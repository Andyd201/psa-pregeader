'use client';
import { useState, useCallback } from 'react';
import UploadZone from '@/components/UploadZone';
import CardPreview from '@/components/CardPreview';
import GradeResult from '@/components/GradeResult';
import type { GradeResponse } from '@/types/grade';

export default function HomePage() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGrade = frontFile !== null && backFile !== null;

  const handleGrade = useCallback(async () => {
    if (!frontFile || !backFile) return;
    setGrading(true);
    setResult(null);
    setError(null);

    const fd = new FormData();
    fd.append('front', frontFile);
    fd.append('back', backFile);

    try {
      const res = await fetch('/api/grade', { method: 'POST', body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Erreur ${res.status}`);
      }
      setResult(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setGrading(false);
    }
  }, [frontFile, backFile]);

  const handleReset = useCallback(() => {
    setFrontFile(null);
    setBackFile(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-zinc-950 font-black text-xs tracking-tight">PSA</span>
            </div>
            <div>
              <h1 className="text-zinc-100 font-bold text-sm leading-none">Pré-évaluation</h1>
              <p className="text-zinc-500 text-xs mt-0.5">Cartes Pokémon anglaises modernes</p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-800"
            >
              Nouvelle carte
            </button>
          )}
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 pb-12">
        {!result ? (
          <>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Photographiez votre carte (recto et verso) pour estimer la probabilité d&apos;obtenir un{' '}
              <span className="text-yellow-400 font-medium">PSA 10</span>.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <UploadZone
                label="Téléverser le recto"
                sublabel="Face avant"
                file={frontFile}
                onChange={setFrontFile}
              />
              <UploadZone
                label="Téléverser le verso"
                sublabel="Face arrière"
                file={backFile}
                onChange={setBackFile}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-950/50 border border-red-800/60 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              onClick={handleGrade}
              disabled={!canGrade || grading}
              className={`w-full h-14 rounded-2xl font-semibold text-base transition-all ${
                canGrade && !grading
                  ? 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-400/20'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              {grading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyse en cours…
                </span>
              ) : (
                'Évaluer ma carte'
              )}
            </button>

            {!canGrade && !grading && (
              <p className="text-center text-xs text-zinc-600">
                {!frontFile && !backFile
                  ? 'Ajoutez le recto et le verso pour continuer'
                  : !frontFile
                  ? 'Ajoutez le recto pour continuer'
                  : 'Ajoutez le verso pour continuer'}
            </p>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {frontFile && <CardPreview file={frontFile} label="Recto" />}
              {backFile && <CardPreview file={backFile} label="Verso" />}
            </div>

            <GradeResult data={result} />

            <button
              onClick={handleReset}
              className="w-full h-12 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all text-sm font-medium"
            >
              Évaluer une autre carte
            </button>
          </>
        )}
      </div>
    </main>
  );
}
