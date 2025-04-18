'use client';

import { useState, useMemo, useEffect } from 'react';
import { Spelare } from '@/models/spelare';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PoängutvecklingChartProps {
  spelare: Spelare[];
}

export default function PoängutvecklingChart({ spelare }: PoängutvecklingChartProps) {
  const [valtSpelarNummer, setValtSpelarNummer] = useState<number | null>(null);
  
  // Kontrollera att spelare-array finns och inte är tom
  if (!spelare || spelare.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
        <div className="flex items-center mb-4">
          <span className="text-xl font-semibold mr-2">📈 Poängutveckling</span>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500 italic">Ingen spelardata tillgänglig</p>
        </div>
      </div>
    );
  }
  
  // Debug-utskrifter
  useEffect(() => {
    console.log('Antal spelare:', spelare?.length);
    console.log('Första spelaren:', spelare?.[0]);
  }, [spelare]);
  
  // Välj den första spelaren som standard (med högst poäng)
  const sorteradeSpelare = useMemo(() => {
    if (!spelare || spelare.length === 0) return [];
    return [...spelare].sort((a, b) => (b.mål + b.assist) - (a.mål + a.assist));
  }, [spelare]);
  
  // Om ingen spelare är vald, välj den första i listan
  useEffect(() => {
    if (!valtSpelarNummer && sorteradeSpelare.length > 0) {
      setValtSpelarNummer(sorteradeSpelare[0].nummer);
    }
  }, [valtSpelarNummer, sorteradeSpelare]);
  
  // Hitta den valda spelaren
  const aktivSpelare = useMemo(() => {
    return sorteradeSpelare.find(s => s.nummer === valtSpelarNummer) || null;
  }, [valtSpelarNummer, sorteradeSpelare]);
  
  // Beräkna kumulativa poäng för den valda spelaren
  const poängData = useMemo(() => {
    if (!aktivSpelare || !aktivSpelare.poäng_per_match) {
      return { 
        labels: [], 
        poäng: [], 
        ackumuleradPoäng: [] 
      };
    }
    
    console.log('Poäng per match:', aktivSpelare.poäng_per_match);
    
    // Sortera matcherna efter datum
    const sorteradePoäng = [...aktivSpelare.poäng_per_match]
      .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime());
    
    const labels = sorteradePoäng.map(p => {
      const datum = new Date(p.datum);
      return datum.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
    });
    
    const poäng = sorteradePoäng.map(p => p.poäng);
    
    // Beräkna ackumulerade poäng
    const ackumuleradPoäng: number[] = [];
    let total = 0;
    
    sorteradePoäng.forEach(p => {
      total += p.poäng;
      ackumuleradPoäng.push(total);
    });
    
    return { labels, poäng, ackumuleradPoäng };
  }, [aktivSpelare]);
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return `${datasetLabel}: ${value} poäng`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Poäng',
          font: {
            weight: 'bold' as const,
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Matchdatum',
          font: {
            weight: 'bold' as const,
          }
        }
      }
    }
  };
  
  const data = {
    labels: poängData.labels,
    datasets: [
      {
        label: 'Poäng per match',
        data: poängData.poäng,
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Ackumulerad poäng',
        data: poängData.ackumuleradPoäng,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      }
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold mr-2">📈 Poängutveckling</span>
      </div>

      <div className="mb-4">
        <label htmlFor="spelarval" className="block text-sm font-medium text-gray-700 mb-1">
          Välj spelare:
        </label>
        <select
          id="spelarval"
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
          value={valtSpelarNummer || ''}
          onChange={(e) => setValtSpelarNummer(Number(e.target.value))}
        >
          {sorteradeSpelare.map((s) => (
            <option key={s.nummer} value={s.nummer}>
              #{s.nummer} {s.namn} ({s.mål + s.assist} poäng)
            </option>
          ))}
        </select>
      </div>
      
      <div className="font-medium text-gray-800 mb-3">
        {aktivSpelare && `#${aktivSpelare.nummer} ${aktivSpelare.namn}`}
      </div>
      
      {aktivSpelare && aktivSpelare.poäng_per_match && aktivSpelare.poäng_per_match.length > 0 ? (
        <Line options={options} data={data} />
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500 italic">
            Ingen poängdata tillgänglig för vald spelare
          </p>
        </div>
      )}
    </div>
  );
} 