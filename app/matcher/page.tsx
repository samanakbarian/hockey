import Link from 'next/link';
import db from '@/lib/db';

interface Match {
  MatchId: number;
  Datum: string;
  Motståndare: string;
  Hemma: number;
  Resultat: string;
  Säsong: string;
  Typ: string;
}

export default async function MatcherPage() {
  let matcher: Match[] = [];
  let error: string | null = null;
  
  try {
    // Hämta alla matcher från databasen
    matcher = db.prepare(`
      SELECT * FROM DimMatch 
      ORDER BY Datum DESC
    `).all() as Match[];
  } catch (e) {
    console.error('Fel vid hämtning av matchdata:', e);
    error = e instanceof Error ? e.message : String(e);
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Matcher</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Ett fel uppstod!</strong>
          <p className="text-sm mt-1">
            {error}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Matchtabell</h2>
        {matcher.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border text-left">Datum</th>
                  <th className="py-2 px-4 border text-left">Motståndare</th>
                  <th className="py-2 px-4 border text-center">Hemma/Borta</th>
                  <th className="py-2 px-4 border text-center">Resultat</th>
                  <th className="py-2 px-4 border text-left">Säsong</th>
                  <th className="py-2 px-4 border text-left">Typ</th>
                  <th className="py-2 px-4 border text-center">Detaljer</th>
                </tr>
              </thead>
              <tbody>
                {matcher.map((match) => (
                  <tr key={match.MatchId} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{match.Datum}</td>
                    <td className="py-2 px-4 border">{match.Motståndare}</td>
                    <td className="py-2 px-4 border text-center">{match.Hemma ? 'Hemma' : 'Borta'}</td>
                    <td className="py-2 px-4 border text-center">{match.Resultat}</td>
                    <td className="py-2 px-4 border">{match.Säsong}</td>
                    <td className="py-2 px-4 border">{match.Typ}</td>
                    <td className="py-2 px-4 border text-center">
                      <Link 
                        href={`/matcher/${match.MatchId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Visa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Inga matcher hittades.</p>
        )}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Kommande funktioner</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Filtrering av matcher (vinster, förluster, hemma, borta)</li>
          <li>Detaljerade matchstatistik med spelarpoäng</li>
          <li>Matchvis analys</li>
        </ul>
      </div>
    </div>
  );
} 