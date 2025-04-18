'use client';

import { useState, useMemo } from 'react';
import { Spelare } from '@/models/spelare';

type SortColumn = 'namn' | 'position' | 'matcher' | 'mål' | 'assist' | 'poäng' | 'plusminus' | 'utvisningsminuter';
type SortDirection = 'asc' | 'desc';
type PositionFilter = 'alla' | 'F' | 'D' | 'G';

interface SpelarTableProps {
  spelare: Spelare[];
}

export default function SpelarTable({ spelare }: SpelarTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('poäng');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('alla');
  
  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const getPositionBadgeClass = (position: string) => {
    switch(position) {
      case 'F': return 'bg-blue-100 text-blue-800';
      case 'D': return 'bg-red-100 text-red-800';
      case 'G': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionText = (position: string) => {
    switch(position) {
      case 'F': return 'Forward';
      case 'D': return 'Back';
      case 'G': return 'Målvakt';
      default: return position;
    }
  };
  
  const filteredAndSortedSpelare = useMemo(() => {
    // Först filtrera baserat på position
    let result = [...spelare];
    if (positionFilter !== 'alla') {
      result = result.filter(s => s.position === positionFilter);
    }
    
    // Sedan sortera
    return result.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      // Hantera specialfallet för poäng som är en beräknad kolumn
      if (sortColumn === 'poäng') {
        aValue = a.mål + a.assist;
        bValue = b.mål + b.assist;
      } else {
        aValue = a[sortColumn];
        bValue = b[sortColumn];
      }
      
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }, [spelare, sortColumn, sortDirection, positionFilter]);
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <button 
            onClick={() => setPositionFilter('alla')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              positionFilter === 'alla' 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Alla positioner
          </button>
          <button 
            onClick={() => setPositionFilter('F')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              positionFilter === 'F' 
                ? 'bg-blue-700 text-white' 
                : 'bg-blue-100 text-blue-800 hover:bg-opacity-80'
            }`}
          >
            Forwards
          </button>
          <button 
            onClick={() => setPositionFilter('D')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              positionFilter === 'D' 
                ? 'bg-red-700 text-white' 
                : 'bg-red-100 text-red-800 hover:bg-opacity-80'
            }`}
          >
            Backar
          </button>
          <button 
            onClick={() => setPositionFilter('G')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              positionFilter === 'G' 
                ? 'bg-purple-700 text-white' 
                : 'bg-purple-100 text-purple-800 hover:bg-opacity-80'
            }`}
          >
            Målvakter
          </button>
        </div>
      </div>
    
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full bg-white">
          <thead className="bg-[#005A32] text-white sticky top-0 z-10">
            <tr>
              <th 
                className="px-4 py-3 text-left cursor-pointer" 
                onClick={() => handleSort('namn')}
              >
                Spelare {sortColumn === 'namn' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => handleSort('position')}
              >
                Position {sortColumn === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('matcher')}
              >
                GP {sortColumn === 'matcher' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('mål')}
              >
                Mål {sortColumn === 'mål' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('assist')}
              >
                Assist {sortColumn === 'assist' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('poäng')}
              >
                Poäng {sortColumn === 'poäng' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('plusminus')}
              >
                +/- {sortColumn === 'plusminus' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => handleSort('utvisningsminuter')}
              >
                UT min {sortColumn === 'utvisningsminuter' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedSpelare.map((spelare, index) => {
              const totalPoäng = spelare.mål + spelare.assist;
              const specialPoäng = totalPoäng > 25;
              const mångaUtvisningar = spelare.utvisningsminuter > 30;
              
              return (
                <tr key={spelare.namn} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                        {spelare.nummer}
                      </div>
                      <span className="mr-1">{spelare.namn}</span>
                      {specialPoäng && <span className="ml-1">🔥</span>}
                      {mångaUtvisningar && <span className="ml-1">⛔️</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPositionBadgeClass(spelare.position)}`}>
                      {getPositionText(spelare.position)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{spelare.matcher}</td>
                  <td className="px-4 py-3 text-right">{spelare.mål}</td>
                  <td className="px-4 py-3 text-right">{spelare.assist}</td>
                  <td className="px-4 py-3 text-right font-bold">
                    {totalPoäng > 20 ? (
                      <span className="text-green-600">{totalPoäng}</span>
                    ) : (
                      totalPoäng
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {spelare.plusminus > 0 ? (
                      <span className="text-green-600">+{spelare.plusminus}</span>
                    ) : spelare.plusminus < 0 ? (
                      <span className="text-red-600">{spelare.plusminus}</span>
                    ) : (
                      spelare.plusminus
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {spelare.utvisningsminuter > 30 ? (
                      <span className="text-red-600">{spelare.utvisningsminuter}</span>
                    ) : (
                      spelare.utvisningsminuter
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 