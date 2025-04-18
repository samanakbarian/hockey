// Spelare från API:et
export interface ApiPlayer {
  SpelarId: number;
  Namn: string;
  Nummer: number;
  Position: 'F' | 'D' | 'G';
  Goals: number;
  Assists: number;
  Points: number;
  PlusMinus: number;
  PenaltyMinutes: number;
  PowerPlayGoals: number;
  ShortHandedGoals: number;
  GameWinningGoals: number;
  Shots: number;
  Hits: number;
  BlockedShots: number;
  GamesPlayed: number;
}

// Match för poängutveckling
export interface ApiMatch {
  matchId: number;
  date: string;
  opponent: string;
  pointsInMatch: number;
  cumulativePoints: number;
  goals: number;
  assists: number;
}

// Nytt progressionsdata-format för API-svar
export interface ProgressionData {
  Datum: string;
  Poäng: number;
  Mål?: number;
  Assist?: number;
}

// Konvertera ApiPlayer till PlayerStat
export interface PlayerStat {
  id: number;
  name: string;
  position: 'F' | 'D' | 'G';
  number: number;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  shortHandedGoals: number;
  gameWinningGoals: number;
  shots: number;
  hits: number;
  blockedShots: number;
  faceoffPercentage: number | null;
  averageTimeOnIce: string;
  savePctg?: number;
  goalsAgainstAvg?: number;
  wins?: number;
  losses?: number;
  shutouts?: number;
}

// För visualiseringar
export interface Spelare {
  namn: string;
  position: 'F' | 'D' | 'G';
  nummer: number;
  matcher: number;
  mål: number;
  assist: number;
  plusminus: number;
  utvisningsminuter: number;
  poäng_per_match?: {
    datum: string;
    poäng: number;
  }[];
} 