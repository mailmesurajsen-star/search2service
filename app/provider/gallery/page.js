'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/use-auth';
import { FileUploader } from '@/components/file-uploader';
import { toast } from 'sonner';
import { ChevronLeft, Image as ImageIcon, Trash2, FileText, Film, Copy, ExternalLink } from 'lucide-react';

export default function ProviderGalleryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth?next=/provider/gallery');
    else if (user && !['provider', 'admin', 'super_admin'].includes(user.role)) router.replace('/');
    else if (user && user.role === 'provider' && !user.plan) router.replace('/provider/plan');
  }, [user, loading, router]);

  const load = () => fetch('/api/provider/media').then(r => r.json()).then(d => setItems(d.items || []));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Delete this file?')) return;
    const r = await fetch(`/api/provider/media/${id}`, { method: 'DELETE' });
    if (r.ok) { toast.success('Deleted'); load(); }
    else toast.error('Failed to delete');
  };

  const copyUrl = (url) => { navigator.clipboard.writeText(window.location.origin + url); toast.success('URL copied'); };

  if (loading || !user) return <div className="p-12 text-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/provider/dashboard" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Dashboard</Link>
          <h1 className="font-bold ml-2">Gallery & Media</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-5xl space-y-5">
        <Card><CardContent className="p-5">
          <h3 className="font-bold mb-3">Upload photos, PDFs & short videos</h3>
          <FileUploader context="provider-gallery" ownerId={user.id} multiple onUploaded={load} />
        </CardContent></Card>

        <div>
          <h3 className="font-bold mb-3">Your uploads ({items.length})</h3>
          {items.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-slate-500">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              No uploads yet.
            </CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(m => (
                <Card key={m.id} className="overflow-hidden">
                  <div className="h-36 bg-slate-100 relative group">
                    {m.mimeType?.startsWith('image/') ? (
                      <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                    ) : m.mimeType?.startsWith('video/') ? (
                      <div className="w-full h-full bg-slate-800 grid place-items-center text-white"><Film className="w-10 h-10" /></div>
                    ) : (
                      <div className="w-full h-full bg-red-50 grid place-items-center text-red-600"><FileText className="w-10 h-10" /></div>
                    )}
                    <button onClick={() => remove(m.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-red-600 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <CardContent className="p-3">
                    <div className="text-xs font-medium truncate">{m.originalName}</div>
                    <div className="text-[10px] text-slate-500">{(m.size/1024).toFixed(0)} KB • {m.context}</div>
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => copyUrl(m.url)} className="flex-1 h-6 rounded bg-blue-50 text-blue-700 text-[10px] font-medium flex items-center justify-center gap-1 hover:bg-blue-100"><Copy className="w-3 h-3" />Copy</button>
                      <a href={m.url} target="_blank" rel="noreferrer" className="flex-1 h-6 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium flex items-center justify-center gap-1 hover:bg-emerald-100"><ExternalLink className="w-3 h-3" />Open</a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
