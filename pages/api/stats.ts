import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { position } = req.query;
    
    let query = `
      SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points, SUM(f.PlusMinus) AS PlusMinus,
             SUM(f.PIM) AS PenaltyMinutes, SUM(f.PPG) AS PowerPlayGoals,
             SUM(f.SHG) AS ShortHandedGoals, SUM(f.GWG) AS GameWinningGoals,
             SUM(f.SOG) AS Shots, SUM(f.Hits) AS Hits,
             SUM(f.BkS) AS BlockedShots, COUNT(f.MatchId) AS GamesPlayed
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
    `;
    
    // Lägg till positionsfiltrering om sådan finns
    const params: any[] = [];
    if (position && position !== 'all') {
      query += ' WHERE s.Position = ?';
      params.push(position);
    }
    
    // Gruppera och sortera
    query += `
      GROUP BY s.SpelarId
      ORDER BY Points DESC
    `;
    
    const players = db.prepare(query).all(...params);
    
    res.status(200).json(players);
  } catch (error) {
    console.error('Fel vid hämtning av spelarstatistik:', error);
    res.status(500).json({ message: 'Kunde inte hämta statistik', error: String(error) });
  }
} 