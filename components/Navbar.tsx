'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#005A32] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="mr-2 font-bold text-[#F6C700] text-2xl">
              <span className="flex items-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 mr-2" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M15,16H9V14H15V16M14.5,11A1.5,1.5 0 0,1 16,9.5A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5A1.5,1.5 0 0,1 14.5,11M9.5,11A1.5,1.5 0 0,1 11,9.5A1.5,1.5 0 0,1 9.5,8A1.5,1.5 0 0,1 8,9.5A1.5,1.5 0 0,1 9.5,11Z" />
                </svg>
                Björklöven
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              href="/" 
              className={`transition-colors hover:underline ${pathname === '/' ? 'text-[#F6C700] font-semibold' : 'text-white'}`}
            >
              Hem
            </Link>
            <Link 
              href="/matcher" 
              className={`transition-colors hover:underline ${pathname === '/matcher' ? 'text-[#F6C700] font-semibold' : 'text-white'}`}
            >
              Matcher
            </Link>
            <Link 
              href="/spelare" 
              className={`transition-colors hover:underline ${pathname === '/spelare' ? 'text-[#F6C700] font-semibold' : 'text-white'}`}
            >
              Spelarstatistik
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 