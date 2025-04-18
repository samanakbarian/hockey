import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface MatchStat {
  MatchId: number;
  Datum: string;
  G: number;
  A: number;
  Points: number;
  PlusMinus: number;
  PIM: number;
  PPG: number;
  SOG: number;
  Hits: number;
}

interface ProgressionData {
  Datum: string;
  Poäng: number;
  Mål: number;
  Assist: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Ogiltigt spelare-ID' });
  }
  
  try {
    // Kontrollera matchdatatabellen för att se vilka kolumner som finns
    try {
      const matchExample = db.prepare('SELECT * FROM DimMatch LIMIT 1').get();
      console.log('Match exempel:', matchExample);
    } catch (error) {
      console.error('Kunde inte hämta matchexempel:', error);
    }
    
    // Hämta spelarens prestationer per match
    // OBS: BkS-kolumnen har tagits bort eftersom den inte finns i databasen
    const matchStats = db.prepare(`
      SELECT f.MatchId, m.Datum,
             f.G, f.A, (f.G + f.A) AS Points,
             f.PlusMinus, f.PIM, f.PPG, f.SOG, f.Hits
      FROM FaktaSpelarStatistik f
      JOIN DimMatch m ON m.MatchId = f.MatchId
      WHERE f.SpelarId = ?
      ORDER BY m.Datum ASC
    `).all(id) as MatchStat[];
    
    // Konvertera till format som förväntas av frontend
    const progression: ProgressionData[] = matchStats.map(match => {
      return {
        Datum: match.Datum,
        Poäng: match.Points,
        Mål: match.G,
        Assist: match.A
      };
    });
    
    res.status(200).json(progression);
  } catch (error) {
    console.error(`Fel vid hämtning av utveckling för spelare med ID ${id}:`, error);
    res.status(500).json({ 
      message: 'Kunde inte hämta spelarens utveckling', 
      error: String(error) 
    });
  }
} 