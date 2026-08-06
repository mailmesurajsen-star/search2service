import { NextResponse } from 'next/server';
import { getDb, getFilesBucket } from '@/lib/mongodb';
import { buildCategories, buildProviders, buildReviews, buildJobs, CATEGORY_ICONS, CATEGORY_GROUPS } from '@/lib/seed-data';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import { LlmChat, UserMessage } from 'emergentintegrations';
import { hashPassword, verifyPassword, signToken, setAuthCookie, clearAuthCookie, getCurrentUser, ROLES } from '@/lib/auth';

const SYSTEM_PROMPT = `You are Search2Service Assistant, a friendly AI concierge for India's complete local-services marketplace (like Justdial + Urban Company + Practo + IndiaMART).

Your job: help users find trusted local service providers — doctors, electricians, plumbers, beauticians, photographers, hotels, restaurants, tuition, government-form-fillers, and more — across India.

Rules:
- Be concise, warm, and use simple English with occasional Hindi words when it fits.
- When provider records are given in the prompt context, treat them as the SOURCE OF TRUTH — quote real names, cities, ratings, and phone numbers from that list only.
- If no matching provider records were passed, ask one clarifying question (e.g., city, area, budget, urgency) — do NOT invent providers.
- Format provider suggestions as a short readable list with name, category, rating, area/city, and phone/WhatsApp. Include a hint like "Tap the card on the site to book / view details."
- For medical questions: give safe general info and ALWAYS recommend consulting a qualified doctor. For emergencies say "Call 108 (Ambulance) or the nearest hospital immediately."
- Never fabricate prices, availability, or credentials.
- Answer in the same language the user writes in (English or Hindi).`;

const MAX_UPLOAD = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
};

async function ensureSeed() {
  const db = await getDb();
  const catCount = await db.collection('categories').countDocuments();
  if (catCount === 0) {
    const cats = buildCategories();
    await db.collection('categories').insertMany(cats);
    const provs = buildProviders(cats);
    await db.collection('providers').insertMany(provs);
    const revs = buildReviews(provs);
    if (revs.length) await db.collection('reviews').insertMany(revs);
    const jobs = buildJobs();
    await db.collection('jobs').insertMany(jobs);
  }
  // Ensure default super admin exists
  const adminExists = await db.collection('users').findOne({ role: 'super_admin' });
  if (!adminExists) {
    const passwordHash = await hashPassword('admin123');
    await db.collection('users').insertOne({
      id: uuid(),
      name: 'Super Admin',
      email: 'admin@search2service.in',
      phone: '',
      role: 'super_admin',
      passwordHash,
      verified: true,
      createdAt: new Date().toISOString(),
    });
  }
  // Idempotent migration: assign per-category icons (v2) to existing categories
  const sample = await db.collection('categories').findOne({});
  if (sample && sample.iconVersion !== 2) {
    const ops = [];
    for (const [name, icon] of Object.entries(CATEGORY_ICONS)) {
      ops.push({ updateMany: { filter: { name }, update: { $set: { icon, iconVersion: 2 } } } });
    }
    // Also store group's own icon in groupIcon field
    for (const g of CATEGORY_GROUPS) {
      ops.push({ updateMany: { filter: { group: g.group }, update: { $set: { groupIcon: g.icon } } } });
    }
    if (ops.length) await db.collection('categories').bulkWrite(ops, { ordered: false });
  }
}

function clean(doc) {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return rest;
}

async function handle(request, ctx) {
  const params = await ctx.params;
  const path = (params?.path || []).join('/');
  const method = request.method;
  const url = new URL(request.url);
  const q = Object.fromEntries(url.searchParams);

  try {
    await ensureSeed();
    const db = await getDb();

    // ============ AUTH ============
    // POST /api/auth/register
    if (path === 'auth/register' && method === 'POST') {
      const body = await request.json();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const name = String(body.name || '').trim();
      const phone = String(body.phone || '').trim();
      let role = String(body.role || 'customer').toLowerCase();
      if (!['customer', 'provider'].includes(role)) role = 'customer'; // public signup limited
      if (!email || !password || !name) return NextResponse.json({ error: 'name, email, password required' }, { status: 400 });
      if (password.length < 6) return NextResponse.json({ error: 'password must be at least 6 characters' }, { status: 400 });
      const exists = await db.collection('users').findOne({ email });
      if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      const passwordHash = await hashPassword(password);
      const user = { id: uuid(), name, email, phone, role, passwordHash, verified: false, createdAt: new Date().toISOString() };
      await db.collection('users').insertOne({ ...user });
      const token = signToken({ uid: user.id, role: user.role, email: user.email });
      await setAuthCookie(token);
      const { passwordHash: _, ...safe } = user;
      return NextResponse.json({ ok: true, user: safe, token }, { status: 201 });
    }

    // POST /api/auth/login
    if (path === 'auth/login' && method === 'POST') {
      const body = await request.json();
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 });
      const user = await db.collection('users').findOne({ email });
      if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const ok = await verifyPassword(password, user.passwordHash);
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const token = signToken({ uid: user.id, role: user.role, email: user.email });
      await setAuthCookie(token);
      const { passwordHash: _, _id, ...safe } = user;
      return NextResponse.json({ ok: true, user: safe, token });
    }

    // GET /api/auth/me
    if (path === 'auth/me' && method === 'GET') {
      const user = await getCurrentUser(request);
      if (!user) return NextResponse.json({ user: null }, { status: 200 });
      return NextResponse.json({ user });
    }

    // POST /api/auth/logout
    if (path === 'auth/logout' && method === 'POST') {
      await clearAuthCookie();
      return NextResponse.json({ ok: true });
    }

    // POST /api/chat - AI concierge (Gemini via Emergent Universal Key)
    if (path === 'chat' && method === 'POST') {
      const body = await request.json();
      const message = String(body.message || '').trim().slice(0, 4000);
      if (!message) return NextResponse.json({ error: 'message is required' }, { status: 400 });
      const sessionId = body.sessionId || uuid();

      // Ground the model with real provider records from MongoDB
      const lower = message.toLowerCase();
      const allCats = await db.collection('categories').find({}, { projection: { name:1, slug:1, group:1, _id:0 } }).toArray();
      const matchedCats = allCats.filter(c => {
        const n = c.name.toLowerCase();
        return n.length >= 3 && lower.includes(n.toLowerCase());
      }).slice(0, 3);
      const allCities = [...new Set((await db.collection('providers').find({}, { projection: { city:1, state:1, _id:0 } }).toArray()).map(p => p.city))];
      const matchedCity = allCities.find(c => lower.includes(c.toLowerCase()));

      const providerFilter = {};
      if (matchedCats.length) providerFilter.categorySlug = { $in: matchedCats.map(c => c.slug) };
      if (matchedCity) providerFilter.city = matchedCity;
      let providers = [];
      if (matchedCats.length || matchedCity) {
        providers = await db.collection('providers').find(providerFilter).sort({ premium: -1, rating: -1 }).limit(6).toArray();
      }
      const groundedContext = providers.length
        ? `\n\nMATCHED PROVIDER RECORDS (from Search2Service database — cite these):\n${JSON.stringify(providers.map(p => ({ id: p.id, name: p.name, category: p.categoryName, area: p.area, city: p.city, state: p.state, rating: p.rating, reviews: p.reviewCount, phone: p.phone, whatsapp: p.whatsapp, fees: p.fees, specialization: p.specialization, url: `/providers/${p.id}` })), null, 2)}`
        : `\n\nNo provider records matched this turn. If the user is asking for a service, politely ask for clarification (which city, what exactly they need) so we can search our database of 300+ providers across 84 categories in 10 Indian cities.`;

      try {
        // Load prior turns from MongoDB for multi-turn context
        const priorTurns = await db.collection('chat_messages').find({ sessionId }).sort({ createdAt: 1 }).limit(20).toArray();
        const initialMessages = [
          { role: 'system', content: SYSTEM_PROMPT + groundedContext },
          ...priorTurns.map(m => ({ role: m.role, content: m.text })),
        ];

        const chat = new LlmChat(
          process.env.EMERGENT_LLM_KEY,
          sessionId,
          SYSTEM_PROMPT + groundedContext,
          initialMessages,
        )
          .withModel('gemini', process.env.GEMINI_MODEL || 'gemini-2.5-flash')
          .withParams({ temperature: 0.4, max_tokens: 800 });

        const answer = await chat.sendMessage(new UserMessage({ text: message }));

        const now = new Date();
        await db.collection('chat_messages').insertMany([
          { id: uuid(), sessionId, role: 'user', text: message, createdAt: now.toISOString() },
          { id: uuid(), sessionId, role: 'assistant', text: answer, createdAt: new Date().toISOString(), providerIds: providers.map(p => p.id) },
        ]);

        return NextResponse.json({
          sessionId,
          answer,
          providers: providers.map(p => ({ id: p.id, name: p.name, category: p.categoryName, city: p.city, area: p.area, rating: p.rating, image: p.images?.[0], url: `/providers/${p.id}` })),
        });
      } catch (err) {
        console.error('chat_error', err?.message || err);
        return NextResponse.json({ error: 'AI service temporarily unavailable', detail: err?.message }, { status: 503 });
      }
    }

    // GET /api/chat/:sessionId - fetch chat history
    if (path.startsWith('chat/') && method === 'GET') {
      const sessionId = path.split('/')[1];
      const msgs = await db.collection('chat_messages').find({ sessionId }).sort({ createdAt: 1 }).limit(200).toArray();
      return NextResponse.json({ items: msgs.map(clean) });
    }

    // POST /api/uploads - multipart file upload via GridFS
    if (path === 'uploads' && method === 'POST') {
      const form = await request.formData();
      const value = form.get('file');
      if (!value || typeof value.arrayBuffer !== 'function') {
        return NextResponse.json({ error: 'file is required' }, { status: 400 });
      }
      if (!ALLOWED_MIME[value.type]) {
        return NextResponse.json({ error: `Unsupported file type: ${value.type}` }, { status: 415 });
      }
      if (value.size <= 0 || value.size > MAX_UPLOAD) {
        return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 413 });
      }
      const bytes = Buffer.from(await value.arrayBuffer());
      const safeName = `${uuid()}${ALLOWED_MIME[value.type]}`;
      const bucket = await getFilesBucket();
      const upload = bucket.openUploadStream(safeName, {
        contentType: value.type,
        metadata: {
          originalName: (value.name || 'file').slice(0, 200),
          declaredMimeType: value.type,
          size: value.size,
          ownerId: form.get('ownerId') || 'anonymous',
          context: form.get('context') || 'general', // e.g. "provider-gallery", "review-photo"
          providerId: form.get('providerId') || null,
        },
      });
      await new Promise((resolve, reject) => {
        upload.once('finish', resolve);
        upload.once('error', reject);
        upload.end(bytes);
      });
      const fileId = String(upload.id);
      const media = {
        id: uuid(),
        fileId,
        originalName: (value.name || 'file').slice(0, 200),
        mimeType: value.type,
        size: value.size,
        url: `/api/files/${fileId}`,
        ownerId: form.get('ownerId') || 'anonymous',
        context: form.get('context') || 'general',
        providerId: form.get('providerId') || null,
        createdAt: new Date().toISOString(),
      };
      await db.collection('media').insertOne({ ...media });
      return NextResponse.json({ ok: true, ...media }, { status: 201 });
    }

    // GET /api/files/:id - stream file from GridFS
    if (path.startsWith('files/') && method === 'GET') {
      const id = path.split('/')[1];
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid file id' }, { status: 400 });
      }
      const fileId = new ObjectId(id);
      const meta = await db.collection('uploads.files').findOne({ _id: fileId });
      if (!meta) return new Response('Not found', { status: 404 });
      const bucket = await getFilesBucket();
      const nodeStream = bucket.openDownloadStream(fileId);
      // Convert Node Readable to Web ReadableStream
      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk) => controller.enqueue(new Uint8Array(chunk)));
          nodeStream.on('end', () => controller.close());
          nodeStream.on('error', (err) => controller.error(err));
        },
        cancel() { nodeStream.destroy(); },
      });
      return new Response(webStream, {
        headers: {
          'Content-Type': meta.contentType || 'application/octet-stream',
          'Content-Length': String(meta.length),
          'Content-Disposition': `inline; filename="${String(meta.metadata?.originalName || meta.filename).replace(/["\\\r\n]/g, '_')}"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // GET /api/media?providerId=&context= - list uploaded media
    if (path === 'media' && method === 'GET') {
      const filter = {};
      if (q.providerId) filter.providerId = q.providerId;
      if (q.context) filter.context = q.context;
      if (q.ownerId) filter.ownerId = q.ownerId;
      const items = await db.collection('media').find(filter).sort({ createdAt: -1 }).limit(100).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/health
    if (path === 'health' && method === 'GET') {
      return NextResponse.json({ ok: true, service: 'Search2Service API', ts: Date.now() });
    }

    // GET /api/stats
    if (path === 'stats' && method === 'GET') {
      const [providers, doctors, reviews, categories] = await Promise.all([
        db.collection('providers').countDocuments(),
        db.collection('providers').countDocuments({ specialization: { $ne: null } }),
        db.collection('reviews').countDocuments(),
        db.collection('categories').countDocuments(),
      ]);
      return NextResponse.json({ providers, doctors, reviews, categories, customers: 25000 + providers*4 });
    }

    // GET /api/categories
    if (path === 'categories' && method === 'GET') {
      const filter = q.popular === 'true' ? { popular: true } : {};
      const cats = await db.collection('categories').find(filter).toArray();
      const grouped = q.grouped === 'true';
      const cleaned = cats.map(clean);
      if (grouped) {
        const groups = {};
        for (const c of cleaned) { (groups[c.group] ||= []).push(c); }
        return NextResponse.json({ groups });
      }
      return NextResponse.json({ categories: cleaned });
    }

    // GET /api/locations
    if (path === 'locations' && method === 'GET') {
      const providers = await db.collection('providers').find({}, { projection: { state:1, district:1, city:1, area:1, _id:0 } }).toArray();
      const states = [...new Set(providers.map(p => p.state))].sort();
      const districts = [...new Set(providers.filter(p => !q.state || p.state === q.state).map(p => p.district))].sort();
      const cities = [...new Set(providers.filter(p => (!q.state || p.state === q.state) && (!q.district || p.district === q.district)).map(p => p.city))].sort();
      const areas = [...new Set(providers.filter(p => (!q.city || p.city === q.city)).map(p => p.area))].sort();
      return NextResponse.json({ states, districts, cities, areas });
    }

    // GET /api/providers - search & filter
    if (path === 'providers' && method === 'GET') {
      const filter = {};
      if (q.category) filter.categorySlug = q.category;
      if (q.group) filter.group = q.group;
      if (q.state) filter.state = q.state;
      if (q.district) filter.district = q.district;
      if (q.city) filter.city = q.city;
      if (q.area) filter.area = q.area;
      if (q.premium === 'true') filter.premium = true;
      if (q.verified === 'true') filter.verified = true;
      if (q.q) {
        const rx = new RegExp(q.q, 'i');
        filter.$or = [{ name: rx }, { categoryName: rx }, { description: rx }, { services: rx }];
      }
      const sort = q.sort === 'rating' ? { rating: -1 } : q.sort === 'newest' ? { createdAt: -1 } : { premium: -1, featured: -1, rating: -1 };
      const limit = Math.min(parseInt(q.limit) || 24, 100);
      const skip = parseInt(q.skip) || 0;
      const [items, total] = await Promise.all([
        db.collection('providers').find(filter).sort(sort).skip(skip).limit(limit).toArray(),
        db.collection('providers').countDocuments(filter),
      ]);
      return NextResponse.json({ items: items.map(clean), total });
    }

    // GET /api/providers/:id
    if (path.startsWith('providers/') && method === 'GET') {
      const id = path.split('/')[1];
      const p = await db.collection('providers').findOne({ id });
      if (!p) return NextResponse.json({ error: 'not found' }, { status: 404 });
      const reviews = await db.collection('reviews').find({ providerId: id }).sort({ createdAt: -1 }).limit(20).toArray();
      const similar = await db.collection('providers').find({ categorySlug: p.categorySlug, id: { $ne: id } }).limit(4).toArray();
      return NextResponse.json({ provider: clean(p), reviews: reviews.map(clean), similar: similar.map(clean) });
    }

    // GET /api/doctors
    if (path === 'doctors' && method === 'GET') {
      const filter = { specialization: { $ne: null } };
      if (q.featured === 'true') filter.featured = true;
      const limit = Math.min(parseInt(q.limit) || 8, 100);
      const items = await db.collection('providers').find(filter).sort({ premium: -1, rating: -1 }).limit(limit).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/hotels
    if (path === 'hotels' && method === 'GET') {
      const limit = Math.min(parseInt(q.limit) || 6, 100);
      const items = await db.collection('providers').find({ categorySlug: 'hotel' }).sort({ rating: -1 }).limit(limit).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/restaurants
    if (path === 'restaurants' && method === 'GET') {
      const limit = Math.min(parseInt(q.limit) || 6, 100);
      const items = await db.collection('providers').find({ categorySlug: 'restaurant' }).sort({ rating: -1 }).limit(limit).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/gov-services
    if (path === 'gov-services' && method === 'GET') {
      const items = await db.collection('providers').find({ group: 'Government Services' }).sort({ rating: -1 }).limit(6).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/jobs
    if (path === 'jobs' && method === 'GET') {
      const limit = Math.min(parseInt(q.limit) || 8, 100);
      const items = await db.collection('jobs').find({}).sort({ createdAt: -1 }).limit(limit).toArray();
      return NextResponse.json({ items: items.map(clean) });
    }

    // GET /api/reviews/recent - testimonials
    if (path === 'reviews/recent' && method === 'GET') {
      const recent = await db.collection('reviews').find({ rating: { $gte: 4 } }).sort({ createdAt: -1 }).limit(9).toArray();
      const withProv = await Promise.all(recent.map(async (r) => {
        const p = await db.collection('providers').findOne({ id: r.providerId }, { projection: { name:1, categoryName:1, city:1, _id:0 } });
        return { ...clean(r), provider: p };
      }));
      return NextResponse.json({ items: withProv });
    }

    // POST /api/reviews
    if (path === 'reviews' && method === 'POST') {
      const body = await request.json();
      const doc = {
        id: uuid(),
        providerId: body.providerId,
        userName: body.userName || 'Anonymous',
        rating: Math.max(1, Math.min(5, parseInt(body.rating) || 5)),
        comment: body.comment || '',
        photos: Array.isArray(body.photos) ? body.photos.slice(0, 6) : [],
        createdAt: new Date().toISOString(),
      };
      await db.collection('reviews').insertOne(doc);
      // update provider rating aggregate
      const revs = await db.collection('reviews').find({ providerId: body.providerId }).toArray();
      const avg = revs.reduce((s, r) => s + r.rating, 0) / revs.length;
      await db.collection('providers').updateOne({ id: body.providerId }, { $set: { rating: parseFloat(avg.toFixed(1)), reviewCount: revs.length } });
      return NextResponse.json({ ok: true, review: doc });
    }

    return NextResponse.json({ error: 'Not found', path, method }, { status: 404 });
  } catch (e) {
    console.error('API error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const HEAD = handle;
export const dynamic = 'force-dynamic';
