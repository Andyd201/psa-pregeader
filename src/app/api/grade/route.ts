import { NextRequest, NextResponse } from 'next/server';
import type { GradeResponse, LimitingSubgrade } from '@/types/grade';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Stub — replace with Python microservice call when OpenCV vision analysis is ready.
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  if (!formData.get('front') || !formData.get('back')) {
    return NextResponse.json(
      { error: 'Images recto et verso requises.' },
      { status: 400 }
    );
  }

  // Simulate analysis latency
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

  const centeringH = parseFloat(rand(50, 63).toFixed(1));
  const centeringV = parseFloat(rand(50, 60).toFixed(1));
  const cornersScore = parseFloat(rand(7.5, 10).toFixed(1));
  const edgesScore = parseFloat(rand(7.5, 10).toFixed(1));
  const surfaceScore = parseFloat(rand(8.0, 10).toFixed(1));

  const centeringHScore = Math.max(0, 10 - (centeringH - 50) * 0.6);
  const centeringVScore = Math.max(0, 10 - (centeringV - 50) * 0.6);
  const centeringScore = (centeringHScore + centeringVScore) / 2;

  const allScores: Array<{ name: LimitingSubgrade; score: number }> = [
    { name: 'centrage', score: centeringScore },
    { name: 'coins', score: cornersScore },
    { name: 'tranches', score: edgesScore },
    { name: 'surface', score: surfaceScore },
  ];

  const limiting = allScores.reduce((a, b) => (a.score < b.score ? a : b));
  const minScore = limiting.score;
  const avgScore = allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length;

  const psa10Likelihood = parseFloat(
    Math.max(0, Math.min(1, Math.pow(minScore / 10, 2.5) * (avgScore / 10))).toFixed(3)
  );

  const reasonings: Record<LimitingSubgrade, string> = {
    centrage: `Le centrage est la principale limitation (${centeringH.toFixed(0)}/${(100 - centeringH).toFixed(0)} horizontal, ${centeringV.toFixed(0)}/${(100 - centeringV).toFixed(0)} vertical). PSA 10 exige 55/45 ou mieux sur les deux axes.`,
    coins: `Les coins présentent des micro-usures (${cornersScore.toFixed(1)}/10) qui limitent les chances d'obtenir un PSA 10. Examinez chaque coin sous lumière rasante.`,
    tranches: `Les tranches montrent des imperfections (${edgesScore.toFixed(1)}/10) qui pénalisent la note. Vérifiez les bords sous bonne lumière naturelle.`,
    surface: `La surface présente des micro-rayures ou des reflets inhabituels (${surfaceScore.toFixed(1)}/10). Conservez la carte en sleeve rigide dès maintenant.`,
  };

  const response: GradeResponse = {
    centering_horizontal_pct: centeringH,
    centering_vertical_pct: centeringV,
    corners_score: cornersScore,
    edges_score: edgesScore,
    surface_score: surfaceScore,
    psa10_likelihood: psa10Likelihood,
    limiting_subgrade: limiting.name,
    reasoning_fr: reasonings[limiting.name],
  };

  return NextResponse.json(response);
}
