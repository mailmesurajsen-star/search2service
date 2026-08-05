'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, X, CheckCircle2, FileText, Film, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,application/pdf,video/mp4,video/webm,video/quicktime';
const MAX_BYTES = 10 * 1024 * 1024;

export function FileUploader({ context = 'general', providerId = null, ownerId = 'anonymous', onUploaded, multiple = false, accept = ACCEPT, buttonLabel = 'Upload file' }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]); // {url, name, mimeType}

  const uploadOne = (file) => new Promise((resolve, reject) => {
    if (file.size > MAX_BYTES) return reject(new Error(`${file.name}: max 10 MB`));
    const body = new FormData();
    body.append('file', file);
    body.append('context', context);
    if (providerId) body.append('providerId', providerId);
    body.append('ownerId', ownerId);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/uploads');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data.error || 'Upload failed'));
      } catch (e) { reject(e); }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(body);
  });

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;
    setUploading(true);
    const uploaded = [];
    for (const f of files) {
      setProgress(0);
      try {
        const res = await uploadOne(f);
        uploaded.push(res);
        setPreviews(p => (multiple ? [...p, res] : [res]));
        toast.success(`${f.name} uploaded`);
      } catch (e) { toast.error(e.message); }
    }
    setUploading(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
    if (onUploaded) onUploaded(multiple ? uploaded : uploaded[0]);
  };

  const onDrop = (e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); };
  const onDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };

  const remove = (u) => setPreviews(p => p.filter(x => x.url !== u.url));

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-xl p-6 text-center cursor-pointer transition-colors"
      >
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="text-sm text-slate-600">Uploading... {progress}%</div>
            <Progress value={progress} className="w-full max-w-xs" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-10 h-10 text-blue-500" />
            <div className="font-semibold text-slate-700">{buttonLabel}</div>
            <div className="text-xs text-slate-500">Drag & drop or click. Images, PDF, or short video. Max 10 MB.</div>
          </div>
        )}
      </div>
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map(p => (
            <div key={p.url} className="relative group border rounded-lg overflow-hidden bg-white">
              <button onClick={() => remove(p)} className="absolute top-1 right-1 z-10 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full grid place-items-center text-xs"><X className="w-3 h-3" /></button>
              {p.mimeType?.startsWith('image/') ? (
                <img src={p.url} alt={p.originalName} className="w-full h-24 object-cover" />
              ) : p.mimeType?.startsWith('video/') ? (
                <div className="w-full h-24 bg-slate-800 grid place-items-center text-white"><Film className="w-8 h-8" /></div>
              ) : p.mimeType === 'application/pdf' ? (
                <div className="w-full h-24 bg-red-50 grid place-items-center text-red-600"><FileText className="w-8 h-8" /></div>
              ) : (
                <div className="w-full h-24 bg-slate-100 grid place-items-center"><ImageIcon className="w-8 h-8 text-slate-400" /></div>
              )}
              <div className="p-2 text-[10px] truncate text-slate-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" />{p.originalName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
