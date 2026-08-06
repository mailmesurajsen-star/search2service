import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from './mongodb';

const SECRET = process.env.JWT_SECRET || 'dev-fallback-not-safe';
const COOKIE_NAME = 's2s_token';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const ROLES = ['customer', 'provider', 'admin', 'super_admin', 'state_manager', 'district_manager'];

export async function hashPassword(pw) { return bcrypt.hash(pw, 10); }
export async function verifyPassword(pw, hash) { return bcrypt.compare(pw, hash); }

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: `${MAX_AGE}s` });
}

export function verifyToken(token) {
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

export async function setAuthCookie(token) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
}

export async function getCurrentUser(request) {
  const jar = await cookies();
  let token = jar.get(COOKIE_NAME)?.value;
  if (!token && request) {
    const auth = request.headers.get('authorization') || '';
    if (auth.startsWith('Bearer ')) token = auth.slice(7);
  }
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = await getDb();
  const user = await db.collection('users').findOne({ id: payload.uid });
  if (!user) return null;
  const { passwordHash, _id, ...safe } = user;
  return safe;
}

export const AUTH_COOKIE = COOKIE_NAME;
