import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'PSA Pré-évaluation — Cartes Pokémon',
  description:
    "Estimez la probabilité d'obtenir un PSA 10 pour vos cartes Pokémon avant soumission.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-zinc-950 antialiased">{children}</body>
    </html>
  );
}
