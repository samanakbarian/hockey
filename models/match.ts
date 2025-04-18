export interface Match {
  datum: string;
  motstånd: string;
  hemma: boolean;
  mål_björklöven: number;
  mål_motstånd: number;
  efter_förlängning: boolean;
}

export const mockadeMatcherData: Match[] = [
  {
    datum: "2025-01-12",
    motstånd: "Modo",
    hemma: true,
    mål_björklöven: 3,
    mål_motstånd: 2,
    efter_förlängning: false
  },
  {
    datum: "2025-01-08",
    motstånd: "Timrå IK",
    hemma: false,
    mål_björklöven: 2,
    mål_motstånd: 4,
    efter_förlängning: false
  },
  {
    datum: "2025-01-05",
    motstånd: "Frölunda",
    hemma: true,
    mål_björklöven: 5,
    mål_motstånd: 3,
    efter_förlängning: false
  },
  {
    datum: "2025-01-01",
    motstånd: "Luleå HF",
    hemma: true,
    mål_björklöven: 3,
    mål_motstånd: 2,
    efter_förlängning: true
  },
  {
    datum: "2024-12-28",
    motstånd: "Skellefteå AIK",
    hemma: false,
    mål_björklöven: 1,
    mål_motstånd: 3,
    efter_förlängning: false
  },
  {
    datum: "2024-12-26",
    motstånd: "HV71",
    hemma: true,
    mål_björklöven: 4,
    mål_motstånd: 3,
    efter_förlängning: false
  },
  {
    datum: "2024-12-22",
    motstånd: "Rögle BK",
    hemma: false,
    mål_björklöven: 2,
    mål_motstånd: 5,
    efter_förlängning: false
  },
  {
    datum: "2025-01-18",
    motstånd: "Växjö Lakers",
    hemma: true,
    mål_björklöven: 0,
    mål_motstånd: 0,
    efter_förlängning: false
  },
  {
    datum: "2025-01-22",
    motstånd: "Linköping HC",
    hemma: false,
    mål_björklöven: 0,
    mål_motstånd: 0,
    efter_förlängning: false
  },
  {
    datum: "2025-01-25",
    motstånd: "Färjestad BK",
    hemma: true,
    mål_björklöven: 0,
    mål_motstånd: 0,
    efter_förlängning: false
  }
]; 