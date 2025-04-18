import Link from 'next/link';
import db from '@/lib/db';

interface Player {
  SpelarId: number;
  Namn: string;
  Nummer: number;
  Position: string;
  GiltigFran: string;
  GiltigTill: string;
}

interface PlayerTotalStats {
  Goals: number;
  Assists: number;
  Points: number;
  PlusMinus: number;
  PenaltyMinutes: number;
  PowerPlayGoals: number;
  Shots: number;
  Hits: number;
  GamesPlayed: number;
  FaceoffPercentage: number | null;
  AverageTimeOnIce: string;
  SW: number;
}

interface PlayerMatchStat {
  MatchId: number;
  Datum: string;
  Motståndare: string;
  Hemma: number;
  Resultat: string;
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
}

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const playerId = parseInt(params.id);
  let player: Player | null = null;
  let playerTotalStats: PlayerTotalStats | null = null;
  let playerMatches: PlayerMatchStat[] = [];
  let error: string | null = null;
  
  try {
    // Hämta spelarinformation
    player = db.prepare(`
      SELECT * FROM DimSpelare 
      WHERE SpelarId = ?
    `).get(playerId) as Player;
    
    if (!player) {
      error = `Spelaren med ID ${playerId} hittades inte`;
    } else {
      // Hämta spelarens total statistik
      const totalStats = db.prepare(`
        SELECT 
          SUM(f.G) AS Goals, 
          SUM(f.A) AS Assists,
          SUM(f.G + f.A) AS Points, 
          SUM(f.PlusMinus) AS PlusMinus,
          SUM(f.PIM) AS PenaltyMinutes, 
          SUM(f.PPG) AS PowerPlayGoals,
          SUM(f.SW) AS SW,
          SUM(f.SOG) AS Shots, 
          SUM(f.Hits) AS Hits,
          COUNT(f.MatchId) AS GamesPlayed,
          SUM(CASE WHEN f.FOW > 0 OR f.FOL > 0 THEN f.FOW * 100.0 / (f.FOW + f.FOL) ELSE NULL END) AS FaceoffPercentage,
          MAX(f.TOI) AS AverageTimeOnIce
        FROM FaktaSpelarStatistik f
        WHERE f.SpelarId = ?
      `).get(playerId) as PlayerTotalStats;
      
      playerTotalStats = totalStats;
      
      // Hämta spelarens matchstatistik
      playerMatches = db.prepare(`
        SELECT 
          m.MatchId, m.Datum, m.Motståndare, m.Hemma, m.Resultat,
          f.G, f.A, (f.G + f.A) AS Points, 
          f.PlusMinus, f.PIM, f.PPG, f.SW, f.SOG, f.TOI, f.Hits
        FROM FaktaSpelarStatistik f
        JOIN DimMatch m ON m.MatchId = f.MatchId
        WHERE f.SpelarId = ?
        ORDER BY m.Datum DESC
      `).all(playerId) as PlayerMatchStat[];
    }
  } catch (e) {
    console.error('Fel vid hämtning av spelardata:', e);
    error = e instanceof Error ? e.message : String(e);
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/spelare" className="text-blue-600 hover:text-blue-800 hover:underline">
          &larr; Tillbaka till spelarlistan
        </Link>
      </div>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Ett fel uppstod!</strong>
          <p className="text-sm mt-1">
            {error}
          </p>
        </div>
      ) : player && playerTotalStats ? (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4">
              #{player.Nummer} {player.Namn}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg mb-6">
              <div>
                <span className="font-semibold">Position:</span> {player.Position}
              </div>
              <div>
                <span className="font-semibold">Tröjnummer:</span> {player.Nummer}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Total statistik</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Matcher</div>
                <div className="text-2xl font-bold">{playerTotalStats.GamesPlayed}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Mål</div>
                <div className="text-2xl font-bold">{playerTotalStats.Goals}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Assist</div>
                <div className="text-2xl font-bold">{playerTotalStats.Assists}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Poäng</div>
                <div className="text-2xl font-bold">{playerTotalStats.Points}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">+/-</div>
                <div className="text-2xl font-bold">{playerTotalStats.PlusMinus}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">PIM</div>
                <div className="text-2xl font-bold">{playerTotalStats.PenaltyMinutes}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">PPG</div>
                <div className="text-2xl font-bold">{playerTotalStats.PowerPlayGoals}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Skott</div>
                <div className="text-2xl font-bold">{playerTotalStats.Shots}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">Hits</div>
                <div className="text-2xl font-bold">{playerTotalStats.Hits}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-gray-700">TOI</div>
                <div className="text-2xl font-bold">{playerTotalStats.AverageTimeOnIce}</div>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Matchstatistik</h2>
          {playerMatches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 border text-left">Datum</th>
                    <th className="py-2 px-3 border text-left">Motståndare</th>
                    <th className="py-2 px-3 border text-center">Resultat</th>
                    <th className="py-2 px-3 border text-center">G</th>
                    <th className="py-2 px-3 border text-center">A</th>
                    <th className="py-2 px-3 border text-center">P</th>
                    <th className="py-2 px-3 border text-center">+/-</th>
                    <th className="py-2 px-3 border text-center">PIM</th>
                    <th className="py-2 px-3 border text-center">PPG</th>
                    <th className="py-2 px-3 border text-center">SOG</th>
                    <th className="py-2 px-3 border text-center">TOI</th>
                    <th className="py-2 px-3 border text-center">Detaljer</th>
                  </tr>
                </thead>
                <tbody>
                  {playerMatches.map((match) => (
                    <tr key={match.MatchId} className="hover:bg-gray-50">
                      <td className="py-2 px-3 border">{match.Datum}</td>
                      <td className="py-2 px-3 border">
                        {match.Hemma ? 'vs ' : '@ '}{match.Motståndare}
                      </td>
                      <td className="py-2 px-3 border text-center">{match.Resultat}</td>
                      <td className="py-2 px-3 border text-center">{match.G}</td>
                      <td className="py-2 px-3 border text-center">{match.A}</td>
                      <td className="py-2 px-3 border text-center font-semibold">{match.Points}</td>
                      <td className="py-2 px-3 border text-center">{match.PlusMinus}</td>
                      <td className="py-2 px-3 border text-center">{match.PIM}</td>
                      <td className="py-2 px-3 border text-center">{match.PPG}</td>
                      <td className="py-2 px-3 border text-center">{match.SOG}</td>
                      <td className="py-2 px-3 border text-center">{match.TOI}</td>
                      <td className="py-2 px-3 border text-center">
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
            <p>Ingen matchstatistik tillgänglig för denna spelare.</p>
          )}
        </>
      ) : (
        <p>Laddar spelarinformation...</p>
      )}
    </div>
  );
} 