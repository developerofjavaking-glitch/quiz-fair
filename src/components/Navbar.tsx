import React from 'react';
import { GameMode, UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { ASSETS } from '../assets';
import { Volume2, VolumeX, Sparkles, Store, Flame } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  setMode: (mode: GameMode) => void;
  stats: UserStats;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  setMode,
  stats,
  isMuted,
  setIsMuted,
}) => {
  const handleToggleSound = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const navItems: { mode: GameMode; label: string }[] = [
    { mode: 'HOME', label: 'মেলা প্রাঙ্গণ' },
    { mode: 'LEVELS', label: 'পরিক্রমা' },
    { mode: 'CATEGORY_SELECT', label: 'বিষয়ভিত্তিক' },
    { mode: 'STORE', label: 'মেলা দোকান' },
    { mode: 'RIDDLE_BOOK', label: 'ধাঁধার খাতা' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-amber-950/90 text-amber-50 border-b border-amber-600/30 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            sounds.playClick();
            setMode('HOME');
          }}
          className="flex items-center gap-2.5 text-left text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-400/40 bg-amber-900/80 flex items-center justify-center shrink-0">
            <img
              src={ASSETS.riddleMaster}
              alt="ধাঁধার মেলা"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-200">
              ধাঁধার মেলা
            </span>
          </div>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-amber-100/90">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  sounds.playClick();
                  setMode(item.mode);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-1 hover:text-amber-300 ${
                  isActive ? 'text-amber-300 font-bold' : 'text-amber-100/80'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Area (Coins pill + Sound toggle) */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Coins Bar */}
          <button
            onClick={() => {
              sounds.playCoin();
              setMode('STORE');
            }}
            title="কয়েন ভাণ্ডার ও দোকান"
            className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-3 py-1.5 rounded-full transition-all text-amber-200 text-sm font-bold shadow-xs whitespace-nowrap shrink-0"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-amber-400">
              <img
                src={ASSETS.melaCoin}
                alt="কয়েন"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="tabular-nums font-bold tracking-wide">
              {toBn(stats.coins)}
            </span>
            <Store className="w-3.5 h-3.5 text-amber-300 opacity-80" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
            className="p-2 rounded-full text-amber-200 hover:text-amber-100 hover:bg-amber-800/40 border border-amber-500/30 transition-colors shrink-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-300/70" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
