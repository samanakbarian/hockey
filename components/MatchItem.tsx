'use client';

import { Match } from '@/models/match';

interface MatchItemProps {
  match: Match;
  compact?: boolean;
}

export default function MatchItem({ match, compact = false }: MatchItemProps) {
  const { datum, motstånd, hemma, mål_björklöven, mål_motstånd, efter_förlängning } = match;
  
  // Avgör om matchen redan är spelad
  const harResultat = mål_björklöven !== 0 || mål_motstånd !== 0;
  const harVunnit = harResultat && mål_björklöven > mål_motstånd;
  const oavgjort = harResultat && mål_björklöven === mål_motstånd;
  
  // Formatera datum
  const datumObj = new Date(datum);
  const formateratDatum = datumObj.toLocaleDateString('sv-SE', {
    day: 'numeric', 
    month: 'short',
    year: compact ? undefined : 'numeric'
  });

  // Formatera resultat
  const resultatText = harResultat
    ? `${mål_björklöven} - ${mål_motstånd}${efter_förlängning ? ' OT' : ''}`
    : 'Kommande';

  if (compact) {
    return (
      <div className={`flex justify-between items-center p-3 rounded-lg ${
        !harResultat 
          ? 'bg-gray-50 border border-gray-200' 
          : harVunnit 
            ? 'bg-green-50 border border-green-200' 
            : oavgjort 
              ? 'bg-yellow-50 border border-yellow-200' 
              : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex-1">
          <span className="font-medium">{hemma ? 'Björklöven' : motstånd}</span>
          <span className="mx-1">-</span>
          <span className="font-medium">{hemma ? motstånd : 'Björklöven'}</span>
          <div className="text-xs text-gray-500 mt-1">{hemma ? 'Hemma' : 'Borta'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{formateratDatum}</div>
          <div className={`font-bold ${
            !harResultat 
              ? 'text-gray-700' 
              : harVunnit 
                ? 'text-green-600' 
                : oavgjort 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
          }`}>{resultatText}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 mb-3 rounded-xl shadow border-l-4 ${
      !harResultat 
        ? 'border-gray-400 bg-white' 
        : harVunnit 
          ? 'border-green-500 bg-green-50' 
          : oavgjort 
            ? 'border-yellow-500 bg-yellow-50' 
            : 'border-red-500 bg-red-50'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm">{formateratDatum}</p>
          <p className="font-bold text-lg">{hemma ? 'Björklöven' : motstånd} - {hemma ? motstånd : 'Björklöven'}</p>
          <div className="mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${
              hemma ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {hemma ? 'Hemma' : 'Borta'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-xl ${
            !harResultat 
              ? 'text-gray-600' 
              : harVunnit 
                ? 'text-green-600' 
                : oavgjort 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
          }`}>{resultatText}</p>
        </div>
      </div>
    </div>
  );
} 