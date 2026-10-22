import React, { useState } from 'react';
import { UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { ChevronLeft, Disc, Sparkles, Gift, ArrowDown } from 'lucide-react';

interface SpinWheelViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

interface WheelSlice {
  label: string;
  type: 'coins' | 'fiftyFifty' | 'hint' | 'timeFreeze' | 'skip';
  amount: number;
  color: string;
  textColor: string;
}

const SLICES: WheelSlice[] = [
  { label: '১০০ কয়েন', type: 'coins', amount: 100, color: '#f59e0b', textColor: '#000' },
  { label: '৫০-৫০', type: 'fiftyFifty', amount: 1, color: '#ef4444', textColor: '#fff' },
  { label: '২০০ কয়েন', type: 'coins', amount: 200, color: '#10b981', textColor: '#fff' },
  { label: '১টি ইঙ্গিত', type: 'hint', amount: 1, color: '#6366f1', textColor: '#fff' },
  { label: '৫০ কয়েন', type: 'coins', amount: 50, color: '#ec4899', textColor: '#fff' },
  { label: '১টি স্কিপ', type: 'skip', amount: 1, color: '#8b5cf6', textColor: '#fff' },
  { label: '৫০০ কয়েন', type: 'coins', amount: 500, color: '#eab308', textColor: '#000' },
  { label: 'সময় ফ্রিজ', type: 'timeFreeze', amount: 1, color: '#06b6d4', textColor: '#000' },
];

export const SpinWheelView: React.FC<SpinWheelViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<WheelSlice | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const hasFreeSpin = stats.lastSpinDate !== todayStr;
  const extraSpinCost = 30;

  const handleSpin = () => {
    if (isSpinning) return;
    if (!hasFreeSpin && stats.coins < extraSpinCost) {
      sounds.playWrong();
      return;
    }

    sounds.playClick();
    setIsSpinning(true);
    setPrizeWon(null);

    // If paid spin, deduct coins
    if (!hasFreeSpin) {
      updateStats((s) => ({ ...s, coins: s.coins - extraSpinCost }));
    }

    // Pick random winning index
    const winningIndex = Math.floor(Math.random() * SLICES.length);
    const sliceAngle = 360 / SLICES.length;
    // Calculate final rotation
    // Add 5-8 full spins (1800 - 2880 deg) + target slice offset
    // Pointer is at TOP (270 deg or 90 deg relative)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    // Index 0 starts at 0 deg, so top is 270 deg
    const targetOffset = 360 - (winningIndex * sliceAngle + sliceAngle / 2);
    const totalRotation = rotation + extraSpins + (targetOffset - (rotation % 360));

    setRotation(totalRotation);

    // Sound ticks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sounds.playTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const prize = SLICES[winningIndex];
      setPrizeWon(prize);
      sounds.playCoin();
      sounds.playFanfare();
      fireConfetti();

      // Apply prize
      updateStats((prev) => {
        const next = { ...prev, lastSpinDate: todayStr };
        if (prize.type === 'coins') {
          next.coins += prize.amount;
        } else {
          next.lifelines = {
            ...next.lifelines,
            [prize.type]: next.lifelines[prize.type] + prize.amount,
          };
        }
        return next;
      });
    }, 4200);
  };

  const sliceAngle = 360 / SLICES.length;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-amber-900/50 hover:bg-amber-800 border border-amber-500/30 text-amber-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
              <Disc className="w-6 h-6 text-yellow-400" />
              <span>ভাগ্যের চাকা (লটারি স্পিন)</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              চাকা ঘুরিয়ে লুফে নিন কয়েন ও লাইফলাইন উপহার!
            </p>
          </div>
        </div>

        <div className="text-xs bg-amber-900/60 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-200 font-bold">
          কয়েন: <strong className="text-amber-300 tabular-nums">{toBn(stats.coins)}</strong>
        </div>
      </div>

      {/* Wheel Area */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center text-amber-50 shadow-xl space-y-6">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
          {/* Top Pointer */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-6 h-7 bg-amber-400 border-2 border-slate-950 rounded-b-md shadow-lg flex items-center justify-center">
              <ArrowDown className="w-4 h-4 text-slate-950 stroke-[3]" />
            </div>
          </div>

          {/* Wheel Disc */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)'
                : 'none',
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SLICES.map((slice, i) => {
                const startAngle = (i * sliceAngle * Math.PI) / 180;
                const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const textAngle = i * sliceAngle + sliceAngle / 2;
                const rad = (textAngle * Math.PI) / 180;
                const tx = 50 + 32 * Math.cos(rad);
                const ty = 50 + 32 * Math.sin(rad);

                return (
                  <g key={i}>
                    <path d={pathData} fill={slice.color} stroke="#78350f" strokeWidth="0.8" />
                    <text
                      x={tx}
                      y={ty}
                      fill={slice.textColor}
                      fontSize="4.2"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                    >
                      {slice.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Inner Center Hub */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 shadow-xl flex items-center justify-center text-amber-300 font-extrabold text-xs">
              <Gift className="w-6 h-6 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Prize Notification Card */}
        {prizeWon && (
          <div className="bg-amber-900/50 border border-amber-400/50 p-4 rounded-2xl max-w-sm mx-auto animate-bounce">
            <span className="text-xs text-amber-300 font-bold block">অভিনন্দন! আপনি জিতেছেন:</span>
            <span className="text-2xl font-black text-white">{prizeWon.label} 🎉</span>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning || (!hasFreeSpin && stats.coins < extraSpinCost)}
            className={`px-8 py-3.5 rounded-2xl font-black text-base shadow-lg transition-all mx-auto flex items-center justify-center gap-2 ${
              isSpinning
                ? 'bg-amber-900/50 text-amber-300/40 cursor-wait'
                : hasFreeSpin
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 active:scale-95'
                : stats.coins >= extraSpinCost
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                : 'bg-amber-950/40 text-amber-400/30 border border-amber-800/40 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>
              {isSpinning
                ? 'চাকা ঘুরছে...'
                : hasFreeSpin
                ? 'বিনামূল্যে স্পিন করুন!'
                : `স্পিন করুন (${toBn(extraSpinCost)} কয়েন)`}
            </span>
          </button>

          <p className="text-xs text-amber-300/70">
            {hasFreeSpin
              ? 'আজকের ১টি ফ্রি স্পিন অবশিষ্ট রয়েছে।'
              : `পরবর্তী ফ্রি স্পিন আগামীকাল। বাড়তি স্পিনের জন্য খরচ ${toBn(extraSpinCost)} কয়েন।`}
          </p>
        </div>
      </div>
    </div>
  );
};
