'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, X, Star, MapPin, Loader2, MessageSquareText, Bot } from 'lucide-react';

const SUGGESTIONS = [
  'Best cardiologist in Mumbai',
  'AC repair near Bandra',
  'Photographer for wedding in Jaipur',
  'PAN card help in Delhi',
];

export function ConciergeChat({ initialOpen = false, floating = true }) {
  const [open, setOpen] = useState(initialOpen);
  const [sessionId, setSessionId] = useState();
  const [items, setItems] = useState([
    { role: 'assistant', text: 'Namaste! 👋 I\'m your Search2Service AI concierge. Tell me what service you need — like "find me a plumber in Andheri" or "best dentist in Bengaluru" — and I\'ll help you instantly.' },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [items, busy]);

  const send = async (msg) => {
    const message = (msg ?? text).trim();
    if (!message || busy) return;
    setText('');
    setItems(x => [...x, { role: 'user', text: message }]);
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setSessionId(data.sessionId);
      setItems(x => [...x, { role: 'assistant', text: data.answer, providers: data.providers }]);
    } catch (e) {
      setItems(x => [...x, { role: 'assistant', text: `Sorry, I hit a snag: ${e.message}. Please try again.` }]);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const panel = (
    <div className={`flex flex-col ${floating ? 'w-[380px] sm:w-[420px] h-[600px] rounded-2xl shadow-2xl' : 'w-full h-[70vh] rounded-xl border'} bg-white overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur grid place-items-center">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold flex items-center gap-1.5">S2 AI Concierge <Sparkles className="w-3.5 h-3.5" /></div>
          <div className="text-[11px] text-blue-50 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" /> Online • Powered by Gemini</div>
        </div>
        {floating && (
          <button onClick={() => setOpen(false)} className="w-8 h-8 grid place-items-center rounded-full hover:bg-white/15">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {items.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border'} rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap shadow-sm`}>
              {m.text}
              {m.providers?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.providers.slice(0, 4).map(p => (
                    <Link key={p.id} href={p.url} className="flex items-center gap-3 bg-slate-50 hover:bg-blue-50 rounded-lg p-2 border transition-colors">
                      {p.image && <div className="w-12 h-12 rounded-md bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${p.image})` }} />}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.category} • {p.area}, {p.city}</div>
                        <div className="text-[10px] flex items-center gap-1 mt-0.5 text-slate-700"><Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />{p.rating}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-3.5 py-2.5 text-sm text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Searching Search2Service…
            </div>
          </div>
        )}
        {items.length === 1 && (
          <div className="pt-2">
            <div className="text-[11px] text-slate-500 mb-2">Try asking:</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-white border hover:bg-blue-50 hover:text-blue-700 text-slate-700">{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t">
        <div className="flex gap-2">
          <Input ref={inputRef} value={text} onChange={e => setText(e.target.value)} placeholder="Ask anything…" onKeyDown={e => e.key === 'Enter' && send()} disabled={busy} className="flex-1" />
          <Button onClick={() => send()} disabled={busy || !text.trim()} className="bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white"><Send className="w-4 h-4" /></Button>
        </div>
        <div className="text-[10px] text-slate-400 mt-1.5 text-center">AI can make mistakes. Verify important info with the provider directly.</div>
      </div>
    </div>
  );

  if (!floating) return panel;

  return (
    <>
      {open ? (
        <div className="fixed bottom-6 right-6 z-[60]">{panel}</div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] h-16 pl-4 pr-5 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-2xl hover:scale-105 transition-transform flex items-center gap-2.5 group"
        >
          <div className="relative">
            <MessageSquareText className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="font-semibold hidden sm:inline">Ask AI Concierge</span>
          <Sparkles className="w-4 h-4 opacity-90" />
        </button>
      )}
    </>
  );
}
