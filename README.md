# Björklövens Hockeystatistik

En webbapplikation som visar statistik för Björklövens lag med tabeller, grafer och detaljerade spelardata. Applikationen använder Next.js, SQLite och Chart.js.

## Funktioner

- **Spelarstatistik:** Tabeller med detaljerade spelarprestationer
- **Visualiseringar:** Poängtoppar och utveckling över tid
- **Filtrering:** Möjlighet att filtrera baserat på position (F/D/G)
- **Sortering:** Anpassningsbara tabeller med olika sorteringsalternativ
- **Detaljvy:** Möjlighet att se enskilda spelares utveckling under säsongen

## Teknisk översikt

Projektet är byggt med:

- **Next.js 15:** Fullstacklösning med både frontend och API
- **SQLite:** Lokal databaslagring via better-sqlite3
- **Chart.js:** Visualisering av spelarstatistik
- **Tailwind CSS:** Styling och responsiv design

## Databasintegration

Applikationen använder en SQLite-databas (hockeystats.db) för att lagra och hämta spelstatistik. Följande tabeller används:

- **DimSpelare:** Spelarinformation (ID, namn, position, nummer)
- **FaktaSpelarStatistik:** Statistik per spelare och match
- **DimMatch:** Information om matcher (datum, motståndare, etc.)

### API-endpoints

Följande API-endpoints har implementerats för att kommunicera med databasen:

- `/api/players` - Hämtar alla spelare med totala statistikvärden
- `/api/player/[id]` - Hämtar detaljerad information om en specifik spelare
- `/api/topscorers` - Returnerar topp 10 poängplockare
- `/api/progression?id=X` - Returnerar poängutveckling över tid för en spelare
- `/api/stats?position=Y` - Filtrerar spelare baserat på position

### Datamodeller

För att hantera data mellan API och frontend används följande modeller:

```typescript
// API-spelare
interface ApiPlayer {
  SpelarId: number;
  Namn: string;
  Nummer: number;
  Position: 'F' | 'D' | 'G';
  Goals: number;
  // ...övriga fält
}

// Frontend-spelare
interface PlayerStat {
  id: number;
  name: string;
  position: 'F' | 'D' | 'G';
  // ...övriga fält
}

// Visualiseringsmodell
interface Spelare {
  namn: string;
  position: 'F' | 'D' | 'G';
  // ...övriga fält
}
```

## Kom igång

### Förutsättningar

- Node.js 18+ 
- Databas (hockeystats.db) placerad i projektroten

### Installation

1. Klona projektet
2. Installera beroenden:
   ```
   npm install
   ```
3. Starta utvecklingsservern:
   ```
   npm run dev
   ```
4. Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare

### Databaskonfiguration

Databasanslutningen konfigureras i `lib/db.ts`:

```typescript
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'hockeystats.db');
const db = new Database(dbPath, { verbose: console.log });

export default db;
```

## Projektstruktur

```
hockey/
├── app/              # Next.js App Router
│   └── spelare/      # Spelarstatistiksida
├── components/       # React-komponenter
│   ├── ui/           # Återanvändbara UI-komponenter
│   ├── PlayerStatsTable.tsx
│   ├── PoängligaChart.tsx
│   └── PoängutvecklingChart.tsx
├── lib/              # Hjälpbibliotek
│   ├── api.ts        # API-hjälpfunktioner
│   ├── db.ts         # Databasanslutning
│   └── types.ts      # Typdefiniton
├── models/           # Datamodeller
│   ├── playerStat.ts # PlayerStat-modell och API
│   └── spelare.ts    # Spelare-modell och API
├── pages/            # Next.js Pages Router
│   └── api/          # API-endpoints
│       ├── player/[id].ts
│       ├── players.ts
│       ├── progression.ts
│       ├── stats.ts
│       └── topscorers.ts
└── public/           # Statiska filer
```

## Felhantering

Applikationen innehåller robusta fellhanteringsfunktioner för databaskommunikation. Om databasanslutning misslyckas eller om data saknas, används fallback-data för att säkerställa att användargränssnittet ändå visas korrekt.

## Framtida förbättringar

- Implementera caching för API-anrop
- Lägga till autentisering för administratörsfunktioner
- Förbättra prestanda på SQL-queries vid större datamängder
- Migrering till PostgreSQL för produktionsdeployment
