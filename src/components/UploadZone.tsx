'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  label: string;
  sublabel?: string;
  file: File | null;
  onChange: (file: File) => void;
}

export default function UploadZone({ label, sublabel, file, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type.startsWith('image/')) onChange(f);
    },
    [onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) onChange(f);
    },
    [onChange]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Téléverser ${label}`}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none min-h-[200px] sm:min-h-[240px] ${
        dragging
          ? 'border-yellow-400 bg-yellow-400/10'
          : file
          ? 'border-zinc-700 bg-zinc-900'
          : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800/80'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        aria-hidden
      />

      {previewUrl ? (
        <div className="relative w-full h-full p-3 group">
          <img
            src={previewUrl}
            alt={label}
            className="w-full object-contain max-h-[220px] rounded-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <span className="bg-black/80 text-white text-sm px-4 py-1.5 rounded-full font-medium">
              Changer
            </span>
          </div>
          <p className="text-center text-zinc-500 text-xs mt-2 truncate px-2">{file?.name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-zinc-200 font-semibold text-sm leading-tight">{label}</p>
            {sublabel && <p className="text-zinc-500 text-xs mt-0.5">{sublabel}</p>}
          </div>
          <p className="text-zinc-600 text-xs">Glisser-déposer ou appuyer</p>
        </div>
      )}
    </div>
  );
}
