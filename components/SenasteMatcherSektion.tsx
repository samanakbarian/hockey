'use client';

import { Match } from '@/models/match';
import MatchItem from './MatchItem';

interface SenasteMatcherSektionProps {
  matcher: Match[];
  antalMatcher?: number;
}

export default function SenasteMatcherSektion({ matcher, antalMatcher = 5 }: SenasteMatcherSektionProps) {
  // Filtrera ut spelade matcher (de som har resultat)
  const speladeMatcherFiltrerade = matcher
    .filter(match => match.mål_björklöven !== 0 || match.mål_motstånd !== 0)
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    .slice(0, antalMatcher);

  return (
    <div>
      {speladeMatcherFiltrerade.length > 0 ? (
        <div className="space-y-3">
          {speladeMatcherFiltrerade.map((match, index) => (
            <MatchItem key={`${match.datum}-${match.motstånd}-${index}`} match={match} compact />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-gray-500 italic">Inga spelade matcher ännu.</p>
        </div>
      )}
    </div>
  );
} 