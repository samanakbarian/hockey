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

interface PlayerMatchStat {
  StatistikId: number;
  SpelarId: number;
  Namn: string;
  Position: string;
  Nummer: number;
  G: number;
  A: number;
  Points: number;
  PlusMinus: number;
  PIM: number;
  PPG: number;
  SW: number;
  SOG: number;
  TOI: string;
  Hits: number;
  FOW: number;
  FOL: number;
  FOProcent: number;
}

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const matchId = parseInt(params.id);
  let match: Match | null = null;
  let playerStats: PlayerMatchStat[] = [];
  let error: string | null = null;
  
  try {
    // Hämta matchinformation
    match = db.prepare(`
      SELECT * FROM DimMatch 
      WHERE MatchId = ?
    `).get(matchId) as Match;
    
    if (!match) {
      error = `Matchen med ID ${matchId} hittades inte`;
    } else {
      // Hämta spelarstatistik för denna match
      playerStats = db.prepare(`
        SELECT s.*, f.StatistikId, f.G, f.A, (f.G + f.A) AS Points, 
               f.PlusMinus, f.PIM, f.PPG, f.SW, f.SOG, f.TOI, 
               f.Hits, f.FOW, f.FOL, f.FOProcent
        FROM FaktaSpelarStatistik f
        JOIN DimSpelare s ON s.SpelarId = f.SpelarId
        WHERE f.MatchId = ?
        ORDER BY Points DESC, s.Namn ASC
      `).all(matchId) as PlayerMatchStat[];
    }
  } catch (e) {
    console.error('Fel vid hämtning av matchdata:', e);
    error = e instanceof Error ? e.message : String(e);
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/matcher" className="text-blue-600 hover:text-blue-800 hover:underline">
          &larr; Tillbaka till matchlistan
        </Link>
      </div>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Ett fel uppstod!</strong>
          <p className="text-sm mt-1">
            {error}
          </p>
        </div>
      ) : match ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Björklöven {match.Hemma ? 'vs' : '@'} {match.Motståndare}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
              <div>
                <span className="font-semibold">Datum:</span> {match.Datum}
              </div>
              <div>
                <span className="font-semibold">Resultat:</span> {match.Resultat}
              </div>
              <div>
                <span className="font-semibold">Match:</span> {match.Hemma ? 'Hemma' : 'Borta'}
              </div>
              <div>
                <span className="font-semibold">Säsong:</span> {match.Säsong}
              </div>
              <div>
                <span className="font-semibold">Matchtyp:</span> {match.Typ}
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Spelarstatistik för denna match</h2>
          {playerStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border text-left">#</th>
                    <th className="py-2 px-3 border text-left">Namn</th>
                    <th className="py-2 px-3 border text-left">Pos</th>
                    <th className="py-2 px-3 border text-center">G</th>
                    <th className="py-2 px-3 border text-center">A</th>
                    <th className="py-2 px-3 border text-center">P</th>
                    <th className="py-2 px-3 border text-center">+/-</th>
                    <th className="py-2 px-3 border text-center">PIM</th>
                    <th className="py-2 px-3 border text-center">PPG</th>
                    <th className="py-2 px-3 border text-center">SOG</th>
                    <th className="py-2 px-3 border text-center">TOI</th>
                    <th className="py-2 px-3 border text-center">Hits</th>
                    <th className="py-2 px-3 border text-center">FO%</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.map((player) => (
                    <tr key={player.StatistikId} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{player.Nummer}</td>
                      <td className="py-2 px-3 border font-medium">
                        <Link 
                          href={`/spelare/${player.SpelarId}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {player.Namn}
                        </Link>
                      </td>
                      <td className="py-2 px-3 border">{player.Position}</td>
                      <td className="py-2 px-3 border text-center">{player.G}</td>
                      <td className="py-2 px-3 border text-center">{player.A}</td>
                      <td className="py-2 px-3 border text-center font-semibold">{player.Points}</td>
                      <td className="py-2 px-3 border text-center">{player.PlusMinus}</td>
                      <td className="py-2 px-3 border text-center">{player.PIM}</td>
                      <td className="py-2 px-3 border text-center">{player.PPG}</td>
                      <td className="py-2 px-3 border text-center">{player.SOG}</td>
                      <td className="py-2 px-3 border text-center">{player.TOI}</td>
                      <td className="py-2 px-3 border text-center">{player.Hits}</td>
                      <td className="py-2 px-3 border text-center">
                        {player.FOW + player.FOL > 0 
                          ? Math.round((player.FOW / (player.FOW + player.FOL)) * 100)
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Ingen spelarstatistik tillgänglig för denna match.</p>
          )}
        </>
      ) : (
        <p>Laddar matchinformation...</p>
      )}
    </div>
  );
} 