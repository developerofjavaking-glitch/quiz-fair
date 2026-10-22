import React from 'react';
import { UserStats } from '../types';
import { ACHIEVEMENTS } from '../data/storeData';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import {
  ChevronLeft,
  Trophy,
  Award,
  Medal,
  Crown,
  MapPin,
  Flame,
  Zap,
  Coins,
  Bookmark,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AchievementsViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-400" />;
      case 'Medal':
        return <Medal className="w-5 h-5 text-orange-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-300" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-yellow-400" />;
      default:
        return <Bookmark className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleClaim = (achId: string, reward: number) => {
    sounds.playCoin();
    sounds.playFanfare();
    fireConfetti();

    updateStats((prev) => ({
      ...prev,
      coins: prev.coins + reward,
      achievementsClaimed: [...prev.achievementsClaimed, achId],
    }));
  };

  const totalAnswered = stats.totalCorrect + stats.totalWrong;
  const winRate = totalAnswered > 0 ? Math.round((stats.totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>অর্জন ও পদক গ্যালারি</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              মাইলফলক অতিক্রম করে কয়েন পুরস্কার ও সম্মাননা পদক অর্জন করুন!
            </p>
          </div>
        </div>

        <div className="text-xs bg-amber-900/60 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-amber-200 font-bold">
          আনলক: <strong className="text-amber-300 tabular-nums">{toBn(stats.achievementsClaimed.length)}</strong> / {toBn(ACHIEVEMENTS.length)}
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[11px] text-amber-300/80 block">মোট সঠিক উত্তর</span>
          <span className="text-2xl font-black text-emerald-400 tabular-nums">
            {toBn(stats.totalCorrect)}
          </span>
        </div>

        <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[11px] text-amber-300/80 block">সফলতার হার</span>
          <span className="text-2xl font-black text-amber-300 tabular-nums">
            %{toBn(winRate)}
          </span>
        </div>

        <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[11px] text-amber-300/80 block">দৈনিক স্ট্রিক</span>
          <span className="text-2xl font-black text-orange-400 tabular-nums">
            {toBn(stats.dailyStreak)} দিন
          </span>
        </div>

        <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[11px] text-amber-300/80 block">বর্তমান লেভেল</span>
          <span className="text-2xl font-black text-yellow-300 tabular-nums">
            {toBn(stats.unlockedLevel)}
          </span>
        </div>
      </div>

      {/* Achievements List */}
      <div className="space-y-3">
        {ACHIEVEMENTS.map((ach) => {
          const { current, max, completed } = ach.progress(stats);
          const isClaimed = stats.achievementsClaimed.includes(ach.id);
          const progressPercent = Math.min((current / max) * 100, 100);

          return (
            <div
              key={ach.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isClaimed
                  ? 'bg-amber-950/40 border-amber-600/15 opacity-70'
                  : completed
                  ? 'bg-amber-900/60 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-amber-950/70 border-amber-500/25'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-900/80 border border-amber-500/30 flex items-center justify-center shrink-0">
                  {getIcon(ach.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-amber-100 truncate">
                      {ach.title}
                    </h2>
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 tabular-nums">
                      +{toBn(ach.rewardCoins)} কয়েন
                    </span>
                  </div>

                  <p className="text-xs text-amber-100/70 mt-0.5">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2.5 max-w-xs">
                    <div className="flex-1 h-1.5 rounded-full bg-amber-900/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-amber-300 font-semibold tabular-nums">
                      {toBn(current)} / {toBn(max)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full sm:w-auto">
                {isClaimed ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    সংগৃহীত ✓
                  </span>
                ) : completed ? (
                  <button
                    onClick={() => handleClaim(ach.id, ach.rewardCoins)}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>পুরস্কার নিন</span>
                  </button>
                ) : (
                  <span className="text-xs text-amber-400/50 bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-600/10 block text-center">
                    চলমান...
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
