import { PlayerStat } from '@/lib/types';
import db from '@/lib/db';

// Fallback-data endast för utveckling
export const mockPlayerStats: PlayerStat[] = [
  {
    id: 1,
    name: "Gustav Possler",
    position: "F",
    number: 22,
    gamesPlayed: 7,
    goals: 3,
    assists: 4,
    points: 7,
    plusMinus: 7,
    penaltyMinutes: 0,
    powerPlayGoals: 1,
    shortHandedGoals: 0,
    gameWinningGoals: 0,
    shots: 10,
    hits: 0,
    blockedShots: 6,
    faceoffPercentage: null,
    averageTimeOnIce: "20:05"
  },
  {
    id: 2,
    name: "Daniel Viksten",
    position: "F",
    number: 19,
    gamesPlayed: 7,
    goals: 0,
    assists: 6,
    points: 6,
    plusMinus: 6,
    penaltyMinutes: 0,
    powerPlayGoals: 0,
    shortHandedGoals: 0,
    gameWinningGoals: 0,
    shots: 14,
    hits: 1,
    blockedShots: 3,
    faceoffPercentage: null,
    averageTimeOnIce: "16:45"
  },
  {
    id: 3,
    name: "Mathew Maione",
    position: "D",
    number: 28,
    gamesPlayed: 7,
    goals: 3,
    assists: 2,
    points: 5,
    plusMinus: 2,
    penaltyMinutes: 2,
    powerPlayGoals: 1,
    shortHandedGoals: 0,
    gameWinningGoals: 0,
    shots: 20,
    hits: 7,
    blockedShots: 7,
    faceoffPercentage: null,
    averageTimeOnIce: "23:40"
  }
];

/**
 * Hämta alla spelare från databasen
 */
export async function getPlayerStats(): Promise<PlayerStat[]> {
  try {
    // Använd databaskoppling direkt istället för att gå via API
    const players = db.prepare(`
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
    `).all();
    
    // Om vi fick data från databasen, konvertera till PlayerStat-modellen
    if (players && players.length > 0) {
      return players.map((player: any) => ({
        id: player.SpelarId,
        name: player.Namn,
        position: player.Position || 'F',
        number: player.Nummer || 0,
        gamesPlayed: player.GamesPlayed || 0,
        goals: player.Goals || 0,
        assists: player.Assists || 0,
        points: player.Points || 0,
        plusMinus: player.PlusMinus || 0,
        penaltyMinutes: player.PenaltyMinutes || 0,
        powerPlayGoals: player.PowerPlayGoals || 0,
        shortHandedGoals: player.ShortHandedGoals || 0,
        gameWinningGoals: player.GameWinningGoals || 0,
        shots: player.Shots || 0,
        hits: player.Hits || 0,
        blockedShots: player.BlockedShots || 0,
        faceoffPercentage: player.FaceoffPercentage || null,
        averageTimeOnIce: player.AverageTimeOnIce || '00:00'
      }));
    }
    
    // Om inga spelardata hittades, använd fallback
    console.warn('Inga spelare hittades i databasen - använder mockdata');
    return mockPlayerStats;
  } catch (error: unknown) {
    // Logga felet
    console.error('Fel vid hämtning av spelarstatistik:', error);
    
    // Använd mockdata som fallback
    console.warn('Ett fel uppstod - använder mockdata som fallback');
    return mockPlayerStats;
  }
} 