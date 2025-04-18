import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Ogiltigt spelare-ID' });
  }
  
  try {
    // Hämta spelarinformation
    const player = db.prepare(`
      SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points, SUM(f.PlusMinus) AS PlusMinus,
             SUM(f.PIM) AS PenaltyMinutes, SUM(f.PPG) AS PowerPlayGoals,
             SUM(f.SHG) AS ShortHandedGoals, SUM(f.GWG) AS GameWinningGoals,
             SUM(f.SOG) AS Shots, SUM(f.Hits) AS Hits,
             SUM(f.BkS) AS BlockedShots, COUNT(f.MatchId) AS GamesPlayed
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
      WHERE s.SpelarId = ?
      GROUP BY s.SpelarId
    `).get(id);
    
    if (!player) {
      return res.status(404).json({ message: 'Spelare hittades inte' });
    }
    
    // Hämta spelarens prestationer per match
    const matchStats = db.prepare(`
      SELECT f.MatchId, m.Datum, m.Motstandare, 
             f.G, f.A, (f.G + f.A) AS Points,
             f.PlusMinus, f.PIM, f.PPG, f.SOG, f.Hits, f.BkS
      FROM FaktaSpelarStatistik f
      JOIN DimMatch m ON m.MatchId = f.MatchId
      WHERE f.SpelarId = ?
      ORDER BY m.Datum ASC
    `).all(id);
    
    // Lägg till matchstatistik till spelaren
    const playerWithMatches = {
      ...player,
      matches: matchStats
    };
    
    res.status(200).json(playerWithMatches);
  } catch (error) {
    console.error(`Fel vid hämtning av spelare med ID ${id}:`, error);
    res.status(500).json({ message: 'Kunde inte hämta spelaren', error: String(error) });
  }
} 