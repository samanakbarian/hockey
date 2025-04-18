import { Spelare } from '@/lib/types';
import db from '@/lib/db';

// Fallback-data om databas-anrop misslyckas
export const mockadeSpelarData: Spelare[] = [
  {
    namn: "Gustav Possler",
    position: "F",
    nummer: 22,
    matcher: 7,
    mål: 3,
    assist: 4,
    plusminus: 7,
    utvisningsminuter: 0,
    poäng_per_match: [
      { datum: "2023-09-15", poäng: 1 },
      { datum: "2023-09-22", poäng: 0 },
      { datum: "2023-09-29", poäng: 2 },
      { datum: "2023-10-06", poäng: 0 },
      { datum: "2023-10-13", poäng: 1 },
      { datum: "2023-10-20", poäng: 0 },
      { datum: "2023-10-27", poäng: 3 }
    ]
  },
  {
    namn: "Daniel Viksten",
    position: "F",
    nummer: 19,
    matcher: 7,
    mål: 0,
    assist: 6,
    plusminus: 6,
    utvisningsminuter: 0,
    poäng_per_match: [
      { datum: "2023-09-15", poäng: 1 },
      { datum: "2023-09-22", poäng: 1 },
      { datum: "2023-09-29", poäng: 0 },
      { datum: "2023-10-06", poäng: 2 },
      { datum: "2023-10-13", poäng: 1 },
      { datum: "2023-10-20", poäng: 1 },
      { datum: "2023-10-27", poäng: 0 }
    ]
  },
  {
    namn: "Mathew Maione",
    position: "D",
    nummer: 28,
    matcher: 7,
    mål: 3,
    assist: 2,
    plusminus: 2,
    utvisningsminuter: 2,
    poäng_per_match: [
      { datum: "2023-09-15", poäng: 0 },
      { datum: "2023-09-22", poäng: 1 },
      { datum: "2023-09-29", poäng: 1 },
      { datum: "2023-10-06", poäng: 0 },
      { datum: "2023-10-13", poäng: 0 },
      { datum: "2023-10-20", poäng: 2 },
      { datum: "2023-10-27", poäng: 1 }
    ]
  }
];

/**
 * Hämta spelare för visualiseringar
 */
export async function getSpelare(): Promise<Spelare[]> {
  try {
    // Hämta de 10 bästa poängplockarna direkt från databasen
    const spelarLista = db.prepare(`
      SELECT s.SpelarId, s.Namn, s.Nummer, s.Position,
             SUM(f.G) AS Goals, SUM(f.A) AS Assists,
             SUM(f.G + f.A) AS Points, SUM(f.PlusMinus) AS PlusMinus,
             SUM(f.PIM) AS PenaltyMinutes,
             COUNT(f.MatchId) AS GamesPlayed
      FROM FaktaSpelarStatistik f
      JOIN DimSpelare s ON s.SpelarId = f.SpelarId
      GROUP BY s.SpelarId
      ORDER BY Points DESC
      LIMIT 10
    `).all();
    
    // Om vi fick data från databasen, mappa till vårt gränssnitt
    if (spelarLista && spelarLista.length > 0) {
      console.log(`Hämtade ${spelarLista.length} spelare för visualiseringar`);
      
      // Konvertera till Spelare-gränssnitt
      const spelareData = spelarLista.map((spelaren: any) => {
        // Skapa grundläggande spelardata
        const spelare: Spelare = {
          namn: spelaren.Namn,
          position: spelaren.Position,
          nummer: spelaren.Nummer,
          matcher: spelaren.GamesPlayed || 0,
          mål: spelaren.Goals || 0,
          assist: spelaren.Assists || 0,
          plusminus: spelaren.PlusMinus || 0,
          utvisningsminuter: spelaren.PenaltyMinutes || 0,
          poäng_per_match: []
        };
        
        // Hämta poängutveckling för varje spelare
        try {
          const progression = db.prepare(`
            SELECT 
              m.MatchId, m.Datum,
              f.G, f.A, (f.G + f.A) AS Poäng
            FROM FaktaSpelarStatistik f
            JOIN DimMatch m ON m.MatchId = f.MatchId
            WHERE f.SpelarId = ?
            ORDER BY m.Datum ASC
          `).all(spelaren.SpelarId);
          
          // Konvertera till poäng_per_match format
          spelare.poäng_per_match = progression.map((p: any) => ({
            datum: p.Datum,
            poäng: p.Poäng
          }));
        } catch (error) {
          console.error(`Kunde inte hämta progression för spelare ${spelaren.Namn}:`, error);
          // Fortsätt med nästa spelare även om progressionen inte kunde hämtas
        }
        
        return spelare;
      });
      
      return spelareData;
    }
    
    // Om inga spelare hittades, fallback till mockdata
    console.warn('Inga spelare hittades i databasen - använder mockdata för visualiseringar');
    return mockadeSpelarData;
  } catch (error: unknown) {
    // Logga felet
    console.error('Fel vid hämtning av spelare för visualiseringar:', error);
    
    // Använd mockdata som fallback
    console.warn('Ett fel uppstod - använder mockdata för visualiseringar');
    return mockadeSpelarData;
  }
} 