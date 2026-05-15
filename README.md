# PSA Pré-évaluation — Cartes Pokémon

Outil de pré-évaluation pour estimer la probabilité d'obtenir un **PSA 10** sur une carte Pokémon, à partir de photos recto/verso.

## Ce qui est construit

- **Interface mobile-first** : upload drag-and-drop ou caméra, responsive desktop
- **Page d'upload** : deux zones d'import (recto / verso) avec aperçu photo
- **Bouton "Évaluer ma carte"** : envoie les images à l'API et affiche les résultats
- **Panneau de résultats** : jauge de probabilité PSA 10, sous-notes visuelles, sous-note limitante avec explication en français

## Ce qui est simulé (mock)

- **`/api/grade` (POST)** : route API stub qui génère des sous-notes aléatoires dans des plages réalistes.  
  Elle sera remplacée par un appel au microservice Python (OpenCV + analyse visuelle) lorsque celui-ci sera prêt.
- **Stockage d'images** : l'interface `StorageClient` dans `src/lib/storage.ts` est un stub local.  
  À remplacer par Cloudflare R2 lors de l'intégration production.

### Format de réponse mock

```json
{
  "centering_horizontal_pct": 54.2,
  "centering_vertical_pct": 51.8,
  "corners_score": 8.7,
  "edges_score": 9.1,
  "surface_score": 9.4,
  "psa10_likelihood": 0.612,
  "limiting_subgrade": "coins",
  "reasoning_fr": "Les coins présentent des usures légères (8.7/10)..."
}
```

## Stack technique

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- Prêt pour déploiement **Vercel**

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Structure du projet

```
src/
├── app/
│   ├── api/grade/route.ts   — API stub (à remplacer par microservice Python)
│   ├── layout.tsx
│   ├── page.tsx             — Page principale
│   └── globals.css
├── components/
│   ├── UploadZone.tsx       — Zone drag-and-drop avec aperçu
│   ├── CardPreview.tsx      — Miniature de la carte soumise
│   ├── GradeResult.tsx      — Panneau de résultats complet
│   └── SubgradeBar.tsx      — Barre de score individuelle
├── lib/
│   └── storage.ts           — Interface stockage (stub local → R2 plus tard)
└── types/
    └── grade.ts             — Types TypeScript partagés
```

## Prochaines étapes

- [ ] Microservice Python (OpenCV) pour la mesure réelle du centrage
- [ ] Stockage des images sur Cloudflare R2
- [ ] Historique des évaluations par utilisateur
- [ ] Support cartes japonaises / vintage
