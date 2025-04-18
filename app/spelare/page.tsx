import { getPlayerStats } from '@/models/playerStat';
import { PlayerStatsTable } from '@/components/PlayerStatsTable';
import Link from 'next/link';
import { PlayerStat } from '@/lib/types';

export default async function SpelarePage() {
  let playerStats: PlayerStat[] = [];
  let error: string | null = null;
  
  try {
    // Hämta spelarstatistik från databasen
    playerStats = await getPlayerStats();
  } catch (e) {
    console.error('Fel vid hämtning av data:', e);
    error = e instanceof Error ? e.message : String(e);
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Spelarstatistik</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Ett fel uppstod!</strong>
          <p className="text-sm mt-1">
            {error}
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Spelartabell</h2>
        <PlayerStatsTable playerStats={playerStats} />
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Kommande funktioner</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Detaljerad statistik per spelare</li>
          <li>Filtrering per position</li>
          <li>Matchvis statistik</li>
        </ul>
      </div>
    </div>
  );
} 