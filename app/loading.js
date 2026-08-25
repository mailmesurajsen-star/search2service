export default function Loading() {
  return (
    <div className="min-h-[60vh] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4" />
      <div className="text-slate-400 text-sm font-medium">Loading Search2Service...</div>
    </div>
  );
}
