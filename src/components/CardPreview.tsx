'use client';
import { useEffect, useState } from 'react';

interface Props {
  file: File;
  label: string;
}

export default function CardPreview({ file, label }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg">
        <img src={url} alt={label} className="w-full object-contain max-h-[160px]" />
      </div>
      <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">{label}</span>
    </div>
  );
}
