interface Props {
  label: string;
  score: number;
  isLimiting?: boolean;
  maxScore?: number;
}

function barColor(score: number, max: number): string {
  const r = score / max;
  if (r >= 0.95) return 'bg-green-500';
  if (r >= 0.85) return 'bg-green-400';
  if (r >= 0.75) return 'bg-yellow-400';
  if (r >= 0.65) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function SubgradeBar({ label, score, isLimiting = false, maxScore = 10 }: Props) {
  const pct = Math.max(0, Math.min(100, (score / maxScore) * 100));
  const color = barColor(score, maxScore);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {isLimiting && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" aria-hidden />}
          <span className={`text-sm font-medium truncate ${isLimiting ? 'text-red-400' : 'text-zinc-300'}`}>
            {label}
          </span>
          {isLimiting && (
            <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20 flex-shrink-0">
              limitant
            </span>
          )}
        </div>
        <span className="text-sm font-mono text-zinc-400 flex-shrink-0">
          {score.toFixed(1)}<span className="text-zinc-600">/{maxScore}</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
