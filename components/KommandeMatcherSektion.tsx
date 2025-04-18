'use client';

import { Match } from '@/models/match';
import MatchItem from './MatchItem';

interface KommandeMatcherSektionProps {
  matcher: Match[];
  antalMatcher?: number;
}

export default function KommandeMatcherSektion({ matcher, antalMatcher = 3 }: KommandeMatcherSektionProps) {
  // Filtrera ut kommande matcher (de som inte har resultat än)
  const kommandeMatcherFiltrerade = matcher
    .filter(match => match.mål_björklöven === 0 && match.mål_motstånd === 0)
    .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
    .slice(0, antalMatcher);

  return (
    <div>
      {kommandeMatcherFiltrerade.length > 0 ? (
        <div className="space-y-3">
          {kommandeMatcherFiltrerade.map((match, index) => (
            <MatchItem key={`${match.datum}-${match.motstånd}-${index}`} match={match} compact />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-gray-500 italic">Inga kommande matcher just nu.</p>
        </div>
      )}
    </div>
  );
} 