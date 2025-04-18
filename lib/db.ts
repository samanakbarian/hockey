import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Definiera typ för tabeller
interface TableInfo {
  name: string;
  [key: string]: any;
}

// Definiera typ för räkning
interface CountResult {
  count: number;
}

// Skapa en databasanslutning
// Kontrollera först att databasen finns på olika möjliga platser
const possiblePaths = [
  // Sökväg i projektroten/data
  path.join(process.cwd(), 'data', 'hockeystats.db'),
  // Sökväg i hockey/data
  path.join(process.cwd(), 'hockey', 'data', 'hockeystats.db'),
  // Sökväg i hockey mappen
  path.join(process.cwd(), 'hockeystats.db'),
  // Relativ till hockey-mappen
  path.join(process.cwd(), '..', 'hockey', 'data', 'hockeystats.db'),
  // Absolut sökväg baserat på felmeddelandet
  'C:\\Users\\saak0033\\source\\repos\\hockey\\hockey\\data\\hockeystats.db'
];

// Hitta första existerande sökvägen
let finalPath = '';
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    finalPath = p;
    break;
  }
}

if (!finalPath) {
  // Om ingen sökväg hittades, använd den som borde vara korrekt enligt felmeddelandet
  finalPath = 'C:\\Users\\saak0033\\source\\repos\\hockey\\hockey\\data\\hockeystats.db';
  console.warn(`Ingen databas hittades på de testade sökvägarna. Använder: ${finalPath}`);
}

console.log('Använder databasfil:', finalPath);
console.log('Fil existerar:', fs.existsSync(finalPath));

// Skapa en variabel för att hålla antingen en riktig databaskoppling eller en tom fallback
let db: any;

// Skapa databasanslutningen
try {
  db = new Database(finalPath, { 
    verbose: console.log 
  });

  // Enkel kontroll för att bekräfta att de tabeller vi förväntar oss finns
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all() as TableInfo[];
    console.log('Databastabeller:', tables.map(t => t.name).join(', '));
    
    // Kontrollera att vi har spelardata
    const playerCount = db.prepare("SELECT COUNT(*) as count FROM DimSpelare").get() as CountResult;
    console.log('Antal spelare i databasen:', playerCount?.count || 0);
    
    // Kontrollera att vi har matchdata
    const matchCount = db.prepare("SELECT COUNT(*) as count FROM DimMatch").get() as CountResult;
    console.log('Antal matcher i databasen:', matchCount?.count || 0);
  } catch (error) {
    console.error('Fel vid kontroll av databas:', error);
  }
} catch (error) {
  console.error('Kunde inte öppna databasen:', error);
  // Skapa en tom database-fallback när filen inte kan öppnas
  // Detta gör att resten av koden fungerar, men alla anrop kommer ge tomma resultat
  db = {
    prepare: () => ({
      all: () => [],
      get: () => null
    })
  };
}

// Exportera databasen (oavsett om det är en riktig koppling eller en fallback)
export default db; 