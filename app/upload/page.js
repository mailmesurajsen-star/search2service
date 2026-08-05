'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileUploader } from '@/components/file-uploader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, UploadCloud, Image as ImageIcon, FileText, Film, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function UploadDemoPage() {
  const [recent, setRecent] = useState([]);

  const loadRecent = async () => {
    const r = await fetch('/api/media?context=demo').then(r => r.json());
    setRecent(r.items || []);
  };
  useEffect(() => { loadRecent(); }, []);

  const copyUrl = (url) => {
    const full = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(full);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4" />Home</Link>
          <div className="flex-1" />
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 grid place-items-center text-white font-bold text-xs">S2</div>
            <span className="font-bold">Search2Service</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-start gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-items-center text-white"><UploadCloud className="w-6 h-6" /></div>
          <div>
            <h1 className="text-3xl font-bold">Media Storage</h1>
            <p className="text-slate-500 mt-1">Upload images, PDFs, or videos. Files are stored securely on our servers and accessible via public URLs.</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">JPEG / PNG / WebP / GIF</Badge>
              <Badge variant="outline">PDF</Badge>
              <Badge variant="outline">MP4 / WebM / MOV</Badge>
              <Badge className="bg-blue-600 hover:bg-blue-600">Max 10 MB</Badge>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-3">Upload files</h3>
            <FileUploader
              context="demo"
              multiple
              buttonLabel="Click or drop files here"
              onUploaded={loadRecent}
            />
          </CardContent>
        </Card>

        <div>
          <h3 className="font-bold mb-3">Recent Uploads ({recent.length})</h3>
          {recent.length === 0 ? (
            <Card><CardContent className="p-12 text-center text-slate-500">
              <UploadCloud className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              No uploads yet. Try uploading a file above.
            </CardContent></Card>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recent.map(m => (
                <Card key={m.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-slate-100 relative">
                    {m.mimeType?.startsWith('image/') ? (
                      <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                    ) : m.mimeType?.startsWith('video/') ? (
                      <video src={m.url} className="w-full h-full object-cover" muted />
                    ) : m.mimeType === 'application/pdf' ? (
                      <div className="w-full h-full bg-red-50 grid place-items-center text-red-600"><FileText className="w-14 h-14" /></div>
                    ) : (
                      <div className="w-full h-full grid place-items-center text-slate-400"><ImageIcon className="w-14 h-14" /></div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-black/70 hover:bg-black/70">{(m.size/1024).toFixed(0)} KB</Badge>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-medium text-sm truncate">{m.originalName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.mimeType}</div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => copyUrl(m.url)} className="flex-1 h-7 rounded bg-blue-50 text-blue-700 text-xs font-medium flex items-center justify-center gap-1 hover:bg-blue-100"><Copy className="w-3 h-3" />Copy URL</button>
                      <a href={m.url} target="_blank" rel="noreferrer" className="flex-1 h-7 rounded bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center justify-center gap-1 hover:bg-emerald-100"><ExternalLink className="w-3 h-3" />Open</a>
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
