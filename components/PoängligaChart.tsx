'use client';

import { Spelare } from '@/models/spelare';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PoängligaChartProps {
  spelare: Spelare[];
}

export default function PoängligaChart({ spelare }: PoängligaChartProps) {
  // Kontrollera att spelare-array finns och inte är tom
  if (!spelare || spelare.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
        <div className="flex items-center mb-4">
          <span className="text-xl font-semibold mr-2">📊 Topp 10 poängplockare</span>
        </div>
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-500 italic">Ingen spelardata tillgänglig</p>
        </div>
      </div>
    );
  }
  
  // Sortera spelare efter poäng och ta de top 10
  const topSpelare = [...spelare]
    .sort((a, b) => (b.mål + b.assist) - (a.mål + a.assist))
    .slice(0, 10);

  // Förbered data för diagram
  const labels = topSpelare.map(s => `#${s.nummer} ${s.namn.split(' ')[0]}`);
  const målData = topSpelare.map(s => s.mål);
  const assistData = topSpelare.map(s => s.assist);
  const poängData = topSpelare.map(s => s.mål + s.assist);

  // Färgkodning baserat på poäng
  const barColors = poängData.map(poäng => {
    if (poäng > 20) return 'rgba(34, 197, 94, 0.8)'; // grön
    if (poäng >= 10) return 'rgba(234, 179, 8, 0.8)'; // gul
    return 'rgba(156, 163, 175, 0.8)'; // grå
  });

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Topp 10 poängplockare',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const spelare = topSpelare[index];
            const totalPoäng = spelare.mål + spelare.assist;
            return [
              `Poäng: ${totalPoäng}`,
              `Mål: ${spelare.mål}`,
              `Assist: ${spelare.assist}`
            ];
          }
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Poäng',
          font: {
            weight: 'bold' as const,
          }
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: 'Spelare',
          font: {
            weight: 'bold' as const,
          }
        },
        stacked: false,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Poäng',
        data: poängData,
        backgroundColor: barColors,
        borderColor: barColors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
      <div className="flex items-center mb-4">
        <span className="text-xl font-semibold mr-2">📊 Topp 10 poängplockare</span>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
} 