import SubgradeBar from './SubgradeBar';
import type { GradeResponse } from '@/types/grade';

interface Props {
  data: GradeResponse;
}

const subgradeLabels: Record<string, string> = {
  centrage: 'Centrage',
  coins: 'Coins',
  tranches: 'Tranches',
  surface: 'Surface',
};

function verdictInfo(p: number): { text: string; colorClass: string } {
  if (p >= 0.8) return { text: 'Excellent candidat PSA 10', colorClass: 'text-green-400' };
  if (p >= 0.6) return { text: 'Bon candidat', colorClass: 'text-yellow-400' };
  if (p >= 0.4) return { text: 'Candidat moyen', colorClass: 'text-orange-400' };
  return { text: 'Peu probable en PSA 10', colorClass: 'text-red-400' };
}

function gaugeStroke(p: number): string {
  if (p >= 0.8) return '#22c55e';
  if (p >= 0.6) return '#facc15';
  if (p >= 0.4) return '#f97316';
  return '#ef4444';
}

function centeringBarColor(score: number): string {
  if (score >= 9.5) return 'bg-green-500';
  if (score >= 8) return 'bg-green-400';
  if (score >= 7) return 'bg-yellow-400';
  if (score >= 6) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function GradeResult({ data }: Props) {
  const pct = Math.round(data.psa10_likelihood * 100);
  const { text: verdictText, colorClass: verdictColor } = verdictInfo(data.psa10_likelihood);

  const centeringHScore = Math.max(0, 10 - (data.centering_horizontal_pct - 50) * 0.6);
  const centeringVScore = Math.max(0, 10 - (data.centering_vertical_pct - 50) * 0.6);
  const centeringScore = (centeringHScore + centeringVScore) / 2;

  const hL = data.centering_horizontal_pct.toFixed(0);
  const hR = (100 - data.centering_horizontal_pct).toFixed(0);
  const vT = data.centering_vertical_pct.toFixed(0);
  const vB = (100 - data.centering_vertical_pct).toFixed(0);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - data.psa10_likelihood);
  const stroke = gaugeStroke(data.psa10_likelihood);

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Overall likelihood gauge */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col items-center gap-4">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
          Probabilité PSA 10
        </p>
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-zinc-100 tabular-nums">{pct}%</span>
            <span className={`text-xs font-semibold mt-0.5 ${verdictColor}`}>PSA 10</span>
          </div>
        </div>
        <p className={`text-base font-semibold ${verdictColor}`}>{verdictText}</p>
        <p className="text-xs text-zinc-600 text-center italic">
          Estimation visuelle — non officielle. Résultats PSA peuvent différer.
        </p>
      </div>

      {/* Subgrades */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex flex-col gap-5">
        <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Sous-notes</h3>

        {/* Centering */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              {data.limiting_subgrade === 'centrage' && (
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" aria-hidden />
              )}
              <span
                className={`text-sm font-medium ${
                  data.limiting_subgrade === 'centrage' ? 'text-red-400' : 'text-zinc-300'
                }`}
              >
                Centrage
              </span>
              {data.limiting_subgrade === 'centrage' && (
                <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20 flex-shrink-0">
                  limitant
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-zinc-500 flex-shrink-0">
              H {hL}/{hR} · V {vT}/{vB}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${centeringBarColor(centeringScore)}`}
              style={{ width: `${(centeringScore / 10) * 100}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600">PSA 10 : 55/45 min · PSA 9 : 60/40 min</p>
        </div>

        <SubgradeBar
          label="Coins"
          score={data.corners_score}
          isLimiting={data.limiting_subgrade === 'coins'}
        />
        <SubgradeBar
          label="Tranches"
          score={data.edges_score}
          isLimiting={data.limiting_subgrade === 'tranches'}
        />
        <SubgradeBar
          label="Surface"
          score={data.surface_score}
          isLimiting={data.limiting_subgrade === 'surface'}
        />
      </div>

      {/* Limiting subgrade reasoning */}
      <div className="bg-zinc-900 rounded-2xl border border-red-900/30 p-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" aria-hidden />
          <h3 className="text-red-400 font-semibold text-sm">
            Sous-note limitante :{' '}
            <span className="font-bold">{subgradeLabels[data.limiting_subgrade]}</span>
          </h3>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{data.reasoning_fr}</p>
      </div>
    </div>
  );
}
