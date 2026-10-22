import React, { useState, useEffect } from 'react';
import { ALL_QUESTIONS, Question } from '../data/questions';
import { UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import {
  ChevronLeft,
  Timer,
  Sparkles,
  Zap,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface TimeRushViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

export const TimeRushView: React.FC<TimeRushViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const [gameState, setGameState] = useState<'READY' | 'PLAYING' | 'FINISHED'>('READY');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);

  const startGame = () => {
    sounds.playClick();
    // Shuffle 50 random questions
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 50);
    setShuffledQuestions(shuffled);
    setCurrentQIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setCoinsEarned(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState('PLAYING');
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const finishGame = () => {
    setGameState('FINISHED');
    sounds.playFanfare();
    fireConfetti();

    updateStats((s) => ({
      ...s,
      bestTimeRushScore: Math.max(s.bestTimeRushScore, score),
    }));
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered || gameState !== 'PLAYING') return;

    const currentQ = shuffledQuestions[currentQIndex];
    if (!currentQ) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      sounds.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const newScore = score + 1;
      setScore(newScore);

      // Reward
      const coinGain = 10 + (newStreak >= 3 ? 10 : 0);
      setCoinsEarned((c) => c + coinGain);
      // Small bonus time
      setTimeLeft((t) => Math.min(t + 2, 60));

      updateStats((s) => ({
        ...s,
        coins: s.coins + coinGain,
        totalCorrect: s.totalCorrect + 1,
      }));
    } else {
      sounds.playWrong();
      setStreak(0);
      updateStats((s) => ({
        ...s,
        totalWrong: s.totalWrong + 1,
      }));
    }

    // Auto advance swiftly after 400ms for rush feel
    setTimeout(() => {
      if (currentQIndex + 1 < shuffledQuestions.length) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        finishGame();
      }
    }, 450);
  };

  const currentQ = shuffledQuestions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
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
              <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <span>দ্রুত চ্যালেঞ্জ (৬০ সেকেন্ড)</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              সময়ের সাথে পাল্লা দিন! দ্রুত সঠিক উত্তর দিয়ে সেরা স্কোর গড়ুন।
            </p>
          </div>
        </div>

        <div className="text-xs bg-amber-900/60 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-200 font-bold">
          সর্বোচ্চ: <strong className="text-amber-300 tabular-nums">{toBn(stats.bestTimeRushScore)}</strong>
        </div>
      </div>

      {/* Game States */}
      {gameState === 'READY' && (
        <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-8 text-center text-amber-50 shadow-md space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl">
            <Timer className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-amber-200">
              আপনি কি ঝড়ের গতিতে খেলতে প্রস্তুত?
            </h2>
            <p className="text-sm text-amber-100/80 max-w-md mx-auto leading-relaxed">
              আপনার কাছে থাকবে ঠিক ৬০ সেকেন্ড সময়। প্রতিটি সঠিক উত্তরে পাবেন পয়েন্ট ও বোনাস কয়েন। একটানা সঠিক উত্তরে মিলবে কম্বো বোনাস!
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-lg font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
          >
            <Zap className="w-6 h-6 fill-slate-950" />
            <span>চ্যালেঞ্জ শুরু করুন!</span>
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && currentQ && (
        <div className="space-y-5">
          {/* Live Progress Hud */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-300/80 block">বাকি সময়</span>
              <span
                className={`text-2xl font-black tabular-nums ${
                  timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-amber-200'
                }`}
              >
                {toBn(timeLeft)} সে
              </span>
            </div>

            <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-300/80 block">পয়েন্ট</span>
              <span className="text-2xl font-black text-emerald-400 tabular-nums">
                {toBn(score)}
              </span>
            </div>

            <div className="bg-amber-950/70 border border-amber-500/20 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-300/80 block">কম্বো স্ট্রিক</span>
              <span className="text-2xl font-black text-orange-400 tabular-nums flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400" />
                {toBn(streak)}
              </span>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-md space-y-6">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>{currentQ.category}</span>
              <span>প্রশ্ন {toBn(currentQIndex + 1)}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-amber-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.answerIndex;

                let style = 'bg-amber-900/40 hover:bg-amber-900/70 border-amber-500/30 text-amber-100';

                if (isAnswered) {
                  if (isCorrect) {
                    style = 'bg-emerald-600 border-emerald-400 text-white font-bold';
                  } else if (isSelected) {
                    style = 'bg-rose-700 border-rose-400 text-white font-bold';
                  } else {
                    style = 'bg-amber-950/30 border-amber-600/10 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`p-4 rounded-xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-2 active:scale-98 ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && (
                      <div>
                        {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-300" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {gameState === 'FINISHED' && (
        <div className="bg-amber-950/85 border border-amber-500/30 rounded-3xl p-8 text-center text-amber-50 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-amber-200">সময় সমাপ্ত!</h2>
            <p className="text-sm text-amber-100/80">
              দারুণ খেলেছেন! আপনার মেধা ও গতির চমৎকার প্রদর্শনী।
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-amber-900/50 border border-amber-500/30 p-4 rounded-2xl">
              <span className="text-xs text-amber-300 block">অর্জিত পয়েন্ট</span>
              <span className="text-3xl font-black text-amber-100 tabular-nums">{toBn(score)}</span>
            </div>
            <div className="bg-amber-900/50 border border-amber-500/30 p-4 rounded-2xl">
              <span className="text-xs text-amber-300 block">জয়ী কয়েন</span>
              <span className="text-3xl font-black text-yellow-400 tabular-nums">+{toBn(coinsEarned)}</span>
            </div>
          </div>

          {score > stats.bestTimeRushScore && (
            <div className="bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>অভিনন্দন! এটি আপনার সর্বকালের নতুন সেরা স্কোর!</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>আবার খেলুন</span>
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 bg-amber-900/60 hover:bg-amber-900 border border-amber-500/30 text-amber-200 font-bold rounded-xl transition-colors"
            >
              মূল পাতায় ফিরে যান
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
