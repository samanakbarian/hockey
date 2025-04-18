import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Hämta limit från query-parametrar, default till 10
    const limit = parseInt(req.query.limit as string) || 10;
    
    console.log(`SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
      GROUP BY s.SpelarId
      ORDER BY Points DESC
      LIMIT ${limit}`);
    
    // Baserat på db-schemat hämtar vi endast nödvändig data
    const players = db.prepare(`
      SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points, SUM(f.PlusMinus) AS PlusMinus,
             SUM(f.PIM) AS PenaltyMinutes,
             COUNT(f.MatchId) AS GamesPlayed
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
      GROUP BY s.SpelarId
      ORDER BY Points DESC
      LIMIT ?
    `).all(limit);
    
    if (!players || players.length === 0) {
      // Om inga poängplockare finns, ge en tom array
      res.status(200).json([]);
      return;
    }
    
    res.status(200).json(players);
  } catch (error) {
    console.error('Fel vid hämtning av toppspelare:', error);
    res.status(500).json({ 
      message: 'Kunde inte hämta toppspelare', 
      error: String(error) 
    });
  }
} 