'use client';

import { useState, useMemo } from 'react';
import { PlayerStat } from '@/lib/types';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlayerStatsTableProps {
  playerStats: PlayerStat[];
}

export function PlayerStatsTable({ playerStats }: PlayerStatsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerStat, direction: 'ascending' | 'descending' }>({
    key: 'points',
    direction: 'descending'
  });

  // Filtrerad och sorterad data
  const filteredPlayers = useMemo(() => {
    return playerStats
      .filter(player => {
        // Sökfiltrering
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Positionsfiltrering
        const matchesPosition = 
          positionFilter === 'all' || 
          player.position === positionFilter;
        
        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        // Sortering
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
  }, [playerStats, searchTerm, positionFilter, sortConfig]);
  
  // Funktion för att formatera nummer och hantera null/undefined värden
  const formatNumber = (value: number | null | undefined, decimals: number = 0) => {
    if (value === null || value === undefined) return '-';
    return typeof value === 'number' ? value.toFixed(decimals) : '-';
  };

  // Funktion för att returnera relevanta kolumner baserat på position
  const getPlayerColumns = (player: PlayerStat | null | undefined) => {
    // Om spelaren är null/undefined, returnera tomma celler
    if (!player) {
      return (
        <>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
        </>
      );
    }
    
    // För målvakter
    if (player.position === 'G') {
      const gp = player.gamesPlayed ?? '-';
      const sv = formatNumber(player.savePctg, 3);
      const gaa = formatNumber(player.goalsAgainstAvg, 2);
      const wins = player.wins ?? 0;
      const losses = player.losses ?? 0;
      const shutouts = player.shutouts ?? 0;
      
      return (
        <>
          <TableCell>{gp}</TableCell>
          <TableCell>{sv}</TableCell>
          <TableCell>{gaa}</TableCell>
          <TableCell>{wins}</TableCell>
          <TableCell>{losses}</TableCell>
          <TableCell>{shutouts}</TableCell>
        </>
      );
    }
    
    // För alla andra positioner
    const gp = player.gamesPlayed ?? '-';
    const goals = player.goals ?? 0;
    const assists = player.assists ?? 0;
    const points = player.points ?? 0;
    const plusMinus = player.plusMinus ?? 0;
    
    return (
      <>
        <TableCell>{gp}</TableCell>
        <TableCell>{goals}</TableCell>
        <TableCell>{assists}</TableCell>
        <TableCell>{points}</TableCell>
        <TableCell>{plusMinus}</TableCell>
      </>
    );
  };
  
  // Funktion för att visa rätt tabellrubriker baserat på position
  const getTableHeaders = () => {
    if (positionFilter === 'G') {
      return (
        <TableRow>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('number')}>#</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('name')}>Spelare</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('gamesPlayed')}>GP</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('savePctg')}>SV%</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('goalsAgainstAvg')}>GAA</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('wins')}>W</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('losses')}>L</TableHeader>
          <TableHeader className="cursor-pointer" onClick={() => handleSort('shutouts')}>SO</TableHeader>
        </TableRow>
      );
    }
    
    return (
      <TableRow>
        <TableHeader className="cursor-pointer" onClick={() => handleSort('number')}>#</TableHeader>
        <TableHeader className="cursor-pointer" onClick={() => handleSort('name')}>Spelare</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('position')}>Pos</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('gamesPlayed')}>GP</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('goals')}>G</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('assists')}>A</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('points')}>TP</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('plusMinus')}>+/-</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('penaltyMinutes')}>PIM</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('powerPlayGoals')}>PPG</TableHeader>
        <TableHeader className="text-center cursor-pointer" onClick={() => handleSort('shots')}>SOG</TableHeader>
      </TableRow>
    );
  };

  // Hantera sortering när användaren klickar på en kolumnrubrik
  const handleSort = (key: keyof PlayerStat) => {
    setSortConfig(current => {
      // Om användaren klickar på samma kolumn, ändra riktning
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'ascending' ? 'descending' : 'ascending'
        };
      }
      
      // Annars, sortera nya kolumnen i fallande ordning som standard
      return {
        key,
        direction: 'descending'
      };
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex space-x-4 items-center">
        <div className="w-1/3">
          <Input 
            placeholder="Sök spelare..." 
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-1/3">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Välj position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla positioner</SelectItem>
              <SelectItem value="F">Forwards</SelectItem>
              <SelectItem value="D">Backar</SelectItem>
              <SelectItem value="G">Målvakter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHead>
          {getTableHeaders()}
        </TableHead>
        <TableBody>
          {filteredPlayers.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.number}</TableCell>
              <TableCell className="font-medium">
                <Link 
                  href={`/spelare/${player.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {player.name}
                </Link>
              </TableCell>
              {getPlayerColumns(player)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Inga spelare hittades. Försök med en annan sökning.
        </div>
      )}
    </div>
  );
} 