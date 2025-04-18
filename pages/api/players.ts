import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Kontrollera först vilka tabeller som finns
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    console.log('Tillgängliga tabeller:', tables);
    
    // Verifiera att tabellerna vi behöver finns
    const hasSpelare = tables.some((t: any) => t.name === 'DimSpelare');
    const hasStatistik = tables.some((t: any) => t.name === 'FaktaSpelarStatistik');
    
    if (!hasSpelare || !hasStatistik) {
      throw new Error(`Saknade tabeller. DimSpelare: ${hasSpelare}, FaktaSpelarStatistik: ${hasStatistik}`);
    }
    
    // Visa en exempelrad från varje tabell för att kontrollera kolumnnamn
    try {
      const exempelSpelare = db.prepare("SELECT * FROM DimSpelare LIMIT 1").get();
      console.log('Exempel spelare:', exempelSpelare);
      
      const exempelStatistik = db.prepare("SELECT * FROM FaktaSpelarStatistik LIMIT 1").get();
      console.log('Exempel statistik:', exempelStatistik);
    } catch (error) {
      console.error('Kunde inte hämta exempeldata:', error);
    }
    
    // Använd dynamisk SQL baserat på databasschemat
    // Med korrekta kolumnnamn från FaktaSpelarStatistik
    // BkS finns inte i din databas - kolumnen har tagits bort
    let query = `
      SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points, SUM(f.PlusMinus) AS PlusMinus,
             SUM(f.PIM) AS PenaltyMinutes, SUM(f.PPG) AS PowerPlayGoals,
             0 AS ShortHandedGoals, SUM(f.SW) AS GameWinningGoals,
             SUM(f.SOG) AS Shots, SUM(f.Hits) AS Hits,
             0 AS BlockedShots, COUNT(f.MatchId) AS GamesPlayed,
             SUM(CASE WHEN f.FOW > 0 OR f.FOL > 0 THEN f.FOW * 100.0 / (f.FOW + f.FOL) ELSE NULL END) AS FaceoffPercentage,
             MAX(f.TOI) AS AverageTimeOnIce
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
      GROUP BY s.SpelarId
      ORDER BY Points DESC
    `;
    
    const players = db.prepare(query).all();
    
    // Kontrollera resultatet
    if (!players || players.length === 0) {
      // Om inga resultat, gör en enklare fråga för att se om det finns några spelare
      const allPlayers = db.prepare('SELECT * FROM DimSpelare').all();
      
      if (allPlayers.length > 0) {
        res.status(200).json(allPlayers.map((p: any) => ({
          SpelarId: p.SpelarId,
          Namn: p.Namn,
          Nummer: p.Nummer || 0,
          Position: p.Position || 'F',
          Goals: 0,
          Assists: 0,
          Points: 0,
          PlusMinus: 0,
          PenaltyMinutes: 0,
          PowerPlayGoals: 0,
          ShortHandedGoals: 0,
          GameWinningGoals: 0,
          Shots: 0,
          Hits: 0,
          BlockedShots: 0,
          GamesPlayed: 0,
          FaceoffPercentage: 0,
          AverageTimeOnIce: '00:00'
        })));
        return;
      }
      
      res.status(404).json({ message: 'Inga spelare hittades i databasen' });
      return;
    }
    
    res.status(200).json(players);
  } catch (error) {
    console.error('Fel vid hämtning av spelare:', error);
    res.status(500).json({ message: 'Kunde inte hämta spelare', error: String(error) });
  }
} 