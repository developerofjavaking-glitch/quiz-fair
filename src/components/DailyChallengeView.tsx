import React, { useState } from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import { UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import {
  ChevronLeft,
  Calendar,
  Sparkles,
  Gift,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';

interface DailyChallengeViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  // Calculate deterministic index based on date string
  const dateSeed = todayStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  const dailyQIndex = (dateSeed * 17) % ALL_QUESTIONS.length;
  const dailyQuestion = ALL_QUESTIONS[dailyQIndex];

  const storageKey = `dhadhar_mela_daily_solved_${todayStr}`;
  const alreadySolved = localStorage.getItem(storageKey) === 'true';

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(alreadySolved);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(alreadySolved);

  const handleOptionClick = (idx: number) => {
    if (isAnswered || alreadySolved) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === dailyQuestion.answerIndex;
    setIsCorrect(correct);

    if (correct) {
      sounds.playCorrect();
      sounds.playCoin();
      sounds.playFanfare();
      fireConfetti();

      localStorage.setItem(storageKey, 'true');

      updateStats((prev) => ({
        ...prev,
        coins: prev.coins + 100,
        totalCorrect: prev.totalCorrect + 1,
      }));
    } else {
      sounds.playWrong();
      updateStats((prev) => ({
        ...prev,
        totalWrong: prev.totalWrong + 1,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
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
              <Calendar className="w-6 h-6 text-yellow-400" />
              <span>দৈনিক ধাঁধা চ্যালেঞ্জ</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              আজকের বিশেষ রহস্যময় ধাঁধা সমাধান করে জিতে নিন ১০০ কয়েন!
            </p>
          </div>
        </div>

        <div className="text-xs bg-amber-900/60 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-200 font-bold">
          পুরস্কার: <strong className="text-yellow-400">১০০ কয়েন</strong>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl space-y-6">
        <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-amber-500/20 pb-3">
          <span>বিষয়: {dailyQuestion.category}</span>
          <span className="flex items-center gap-1 text-yellow-400 font-bold">
            <Gift className="w-4 h-4" />
            +১০০ কয়েন বোনাস
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-amber-100 leading-snug">
          {dailyQuestion.question}
        </h2>

        {/* Hint button/banner */}
        {!showHint && !isAnswered && (
          <button
            onClick={() => {
              sounds.playClick();
              setShowHint(true);
            }}
            className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 hover:underline"
          >
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
            <span>একটি ইঙ্গিত দেখুন</span>
          </button>
        )}

        {showHint && (
          <div className="bg-amber-900/40 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-200">
            <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <span><strong className="text-amber-300">ইঙ্গিত:</strong> {dailyQuestion.hint}</span>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {dailyQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isAnsCorrect = idx === dailyQuestion.answerIndex;

            let style = 'bg-amber-900/40 hover:bg-amber-900/70 border-amber-500/30 text-amber-100';

            if (isAnswered) {
              if (isAnsCorrect) {
                style = 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-md';
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
                    {isAnsCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                    {isSelected && !isAnsCorrect && <XCircle className="w-5 h-5 text-rose-300" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Reveal / Solution Explanation */}
        {isAnswered && (
          <div className="pt-4 border-t border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Sparkles className="w-5 h-5" />
                  <span>অসাধারণ! আপনি আজকের দৈনিক চ্যালেঞ্জ জয় করেছেন (+১০০ কয়েন যোগ হয়েছে)!</span>
                </div>
              ) : (
                <div className="text-rose-400 font-bold text-sm">
                  ওহ্ উত্তরটি সঠিক হয়নি! আগামীকাল আবার চেষ্টা করুন।
                </div>
              )}
            </div>

            {dailyQuestion.explanation && (
              <p className="text-xs sm:text-sm text-amber-100/90 bg-amber-900/30 p-3.5 rounded-xl border border-amber-500/20 leading-relaxed">
                {dailyQuestion.explanation}
              </p>
            )}

            <button
              onClick={onBack}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
            >
              মূল পাতায় ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
