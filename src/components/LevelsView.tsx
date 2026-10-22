import React from 'react';
import { UserStats } from '../types';
import { ALL_QUESTIONS } from '../data/questions';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { Lock, Star, ChevronLeft, Trophy, Play, CheckCircle2 } from 'lucide-react';

interface LevelsViewProps {
  stats: UserStats;
  onSelectLevel: (levelNum: number) => void;
  onBack: () => void;
}

export const LevelsView: React.FC<LevelsViewProps> = ({
  stats,
  onSelectLevel,
  onBack,
}) => {
  const TOTAL_LEVELS = 100;
  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  // Count total stars
  const totalStars = Object.values(stats.levelStars).reduce((sum, s) => sum + s, 0);

  // Helper to count how many questions of a level are already solved
  const getLevelSolvedCount = (lvl: number) => {
    const startIndex = ((lvl - 1) * 10) % (ALL_QUESTIONS.length - 10);
    const lvlQuestions = ALL_QUESTIONS.slice(startIndex, startIndex + 10);
    return lvlQuestions.filter((q) => stats.solvedQuestionIds.includes(q.id)).length;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-5 text-amber-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <h1 className="text-2xl font-bold text-amber-100">মেলা পরিক্রমা (১০০ লেভেল)</h1>
            <p className="text-xs text-amber-300/80">
              ১০টি করে ধাঁধা প্রতি লেভেলে। আপনার সমাধানকৃত ধাঁধাগুলো স্থায়ীভাবে সেভ থাকে।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-amber-900/60 border border-amber-500/30 px-3.5 py-2 rounded-xl font-bold text-amber-200">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>মোট স্টার:</span>
            <span className="tabular-nums font-extrabold text-sm text-amber-200">
              {toBn(totalStars)} / {toBn(TOTAL_LEVELS * 3)}
            </span>
          </div>
          <span>·</span>
          <span>উন্মুক্ত: লেভেল {toBn(stats.unlockedLevel)}</span>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {levels.map((lvl) => {
          const isUnlocked = lvl <= stats.unlockedLevel;
          const stars = stats.levelStars[lvl] || 0;
          const isCurrent = lvl === stats.unlockedLevel;
          const solvedInThisLevel = isUnlocked ? getLevelSolvedCount(lvl) : 0;
          const isFullySolved = solvedInThisLevel === 10;

          return (
            <button
              key={lvl}
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) {
                  sounds.playClick();
                  onSelectLevel(lvl);
                }
              }}
              className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[105px] border transition-all duration-150 ${
                isCurrent
                  ? 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-300 text-slate-950 font-extrabold shadow-lg scale-105 ring-2 ring-amber-300'
                  : isFullySolved
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100 hover:bg-emerald-900/80'
                  : isUnlocked
                  ? 'bg-amber-950/70 hover:bg-amber-900/90 border-amber-500/40 text-amber-100 hover:border-amber-400 active:scale-95'
                  : 'bg-amber-950/20 border-amber-900/20 text-amber-400/30 cursor-not-allowed opacity-60'
              }`}
            >
              <span className="text-[11px] font-semibold opacity-85">
                ধাপ {toBn(lvl)}
              </span>

              <div className="my-0.5">
                {!isUnlocked ? (
                  <Lock className="w-5 h-5 text-amber-500/40" />
                ) : isCurrent ? (
                  <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
                ) : isFullySolved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Trophy className="w-5 h-5 text-amber-400/80" />
                )}
              </div>

              {/* Solved Count Tag */}
              {isUnlocked && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isCurrent
                      ? 'bg-slate-950/20 text-slate-950'
                      : isFullySolved
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-amber-300/80'
                  }`}
                >
                  {toBn(solvedInThisLevel)}/১০
                </span>
              )}

              {/* Stars */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-3 h-3 ${
                      starIdx <= stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : isCurrent
                        ? 'text-slate-900/40'
                        : 'text-amber-500/20'
                    }`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
