import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toolkitTabs } from './Navigation';
import LoadingSpinner from './LoadingSpinner';

interface ToolkitLoaderProps {
  activeToolkit?: string;
  onClose: () => void;
}

export default function ToolkitLoader({ activeToolkit, onClose }: ToolkitLoaderProps) {
  const toolkit = toolkitTabs.find((item) => item.id === activeToolkit);
  const [loading, setLoading] = useState(true);

  if (!toolkit) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-black">
      {/* Back button - top right only */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-[2100] inline-flex items-center gap-2 rounded-full border-2 border-yellow-500/70 bg-black/80 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.4)] backdrop-blur-md transition hover:scale-105 hover:bg-yellow-400 hover:text-black"
        aria-label="Back to site"
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </button>

      {/* Loading overlay */}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[2050] flex flex-col items-center justify-center gap-5 bg-black">
          <LoadingSpinner size={90} />
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">Loading {toolkit.title}...</p>
        </div>
      )}

      {/* Full-screen embedded local sub-page */}
      <iframe
        key={toolkit.id}
        title={toolkit.title}
        src={toolkit.file}
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
        className="h-full w-full flex-1 border-0 bg-black"
      />
    </div>
  );
}
