'use client';

import Link from 'next/link';
import { mockadeMatcherData } from '@/models/match';
import SenasteMatcherSektion from '@/components/SenasteMatcherSektion';
import KommandeMatcherSektion from '@/components/KommandeMatcherSektion';

export default function Home() {
  return (
    <div className="py-6">
      <header className="text-center py-8 mb-10 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-[#005A32] mb-3">Björklöven Hockeystatistik</h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Välkommen till Björklövens statistikportal där du hittar all information om matcher och spelarstatistik
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
          <h2 className="text-xl font-semibold text-[#005A32] mb-4 flex items-center">
            <span className="mr-2">🏒</span>
            Senaste matcher
          </h2>
          <SenasteMatcherSektion matcher={mockadeMatcherData} />
        </section>
        
        <section className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
          <h2 className="text-xl font-semibold text-[#005A32] mb-4 flex items-center">
            <span className="mr-2">📅</span>
            Kommande matcher
          </h2>
          <KommandeMatcherSektion matcher={mockadeMatcherData} />
        </section>
        
        <section className="bg-white rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition-transform">
          <h2 className="text-xl font-semibold text-[#005A32] mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Tabellplacering
          </h2>
          <div className="p-5 rounded-lg border-l-4 border-[#005A32] bg-gray-50">
            <p className="text-5xl font-bold text-center text-[#005A32]">3:a</p>
            <p className="text-center text-gray-600 mt-2">i HockeyAllsvenskan</p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/matcher"
              className="bg-[#005A32] hover:bg-opacity-90 text-white font-bold py-4 px-4 rounded-lg shadow text-center transition-all"
            >
              Alla matcher
            </Link>
            <Link 
              href="/spelare"
              className="bg-[#005A32] hover:bg-opacity-90 text-white font-bold py-4 px-4 rounded-lg shadow text-center transition-all"
            >
              Spelarstatistik
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
