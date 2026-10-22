import React, { useState, useEffect } from 'react';
import { Question } from '../data/questions';
import { UserStats } from '../types';
import { toBn, getRandomPraise, getRandomEncourage } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { recordAnswerInStats } from '../utils/storage';
import {
  HelpCircle,
  Lightbulb,
  Clock,
  FastForward,
  Sparkles,
  Percent,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Bookmark,
  BookmarkCheck,
  CheckCheck,
  Award,
} from 'lucide-react';

interface QuizBoardProps {
  questions: Question[];
  title: string;
  subtitle?: string;
  onFinish: (result: { score: number; total: number; coinsEarned: number }) => void;
  onExit: () => void;
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  isTimed?: boolean;
  timeLimit?: number; // in seconds
}

export const QuizBoard: React.FC<QuizBoardProps> = ({
  questions,
  title,
  subtitle,
  onFinish,
  onExit,
  stats,
  updateStats,
  isTimed = false,
  timeLimit = 25,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAlreadySolved, setIsAlreadySolved] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [doubleCoinsActive, setDoubleCoinsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsEarnedThisSession, setCoinsEarnedThisSession] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [streak, setStreak] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const currentQ = questions[currentIndex];
  const isBookmarked = stats.bookmarkedQuestionIds.includes(currentQ?.id);

  // Check if current question was already solved in localStorage
  useEffect(() => {
    if (!currentQ) return;
    const previouslySolved = stats.solvedQuestionIds.includes(currentQ.id);
    const prevAnswer = stats.answeredQuestions[currentQ.id];

    if (previouslySolved) {
      setIsAlreadySolved(true);
      setIsAnswered(true);
      setSelectedOption(prevAnswer?.selectedOption ?? currentQ.answerIndex);
      setFeedbackMsg('এই ধাঁধাটি আপনি পূর্বে সফলভাবে সমাধান করেছেন ✓');
    } else {
      setIsAlreadySolved(false);
      setIsAnswered(false);
      setSelectedOption(null);
      setFeedbackMsg('');
    }
    setDisabledOptions([]);
    setShowHint(false);
    setTimeLeft(timeLimit);
  }, [currentIndex, currentQ, stats.solvedQuestionIds]);

  // Timer loop for timed questions (only runs if unanswered and timed)
  useEffect(() => {
    if (!isTimed || isAnswered || isAlreadySolved || !currentQ) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnswered, isAlreadySolved, isTimed, currentQ]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1);
    sounds.playWrong();
    setStreak(0);
    setFeedbackMsg('সময় শেষ হয়ে গেছে!');

    // Record timeout/wrong answer in localStorage
    updateStats((s) => {
      const recorded = recordAnswerInStats(s, currentQ.id, -1, false);
      return {
        ...recorded,
        totalWrong: recorded.totalWrong + 1,
      };
    });
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswered || disabledOptions.includes(idx)) return;

    sounds.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answerIndex;

    if (isCorrect) {
      sounds.playCorrect();
      setStreak((prev) => prev + 1);
      setScore((s) => s + 1);

      // Coins reward calculation
      let earned = 15;
      if (streak >= 2) earned += 5; // Streak bonus
      if (doubleCoinsActive) earned *= 2;

      setCoinsEarnedThisSession((c) => c + earned);
      setFeedbackMsg(getRandomPraise());
      sounds.playCoin();

      // Save answer permanently in localStorage
      updateStats((s) => {
        const recorded = recordAnswerInStats(s, currentQ.id, idx, true);
        return {
          ...recorded,
          coins: recorded.coins + earned,
          totalCorrect: recorded.totalCorrect + 1,
        };
      });
    } else {
      sounds.playWrong();
      setStreak(0);
      setFeedbackMsg(getRandomEncourage());

      // Save answer in localStorage
      updateStats((s) => {
        const recorded = recordAnswerInStats(s, currentQ.id, idx, false);
        return {
          ...recorded,
          totalWrong: recorded.totalWrong + 1,
        };
      });
    }

    if (doubleCoinsActive) {
      setDoubleCoinsActive(false);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed round
      sounds.playFanfare();
      fireConfetti();
      onFinish({
        score: score + (isAlreadySolved || selectedOption === currentQ.answerIndex ? 1 : 0),
        total: questions.length,
        coinsEarned: coinsEarnedThisSession,
      });
    }
  };

  // Lifeline 1: 50-50
  const useFiftyFifty = () => {
    if (stats.lifelines.fiftyFifty <= 0 || isAnswered || disabledOptions.length > 0) return;
    sounds.playLifeline();

    // Pick 2 wrong answers to disable
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.answerIndex);
    const toDisable = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setDisabledOptions(toDisable);

    updateStats((s) => ({
      ...s,
      lifelines: { ...s.lifelines, fiftyFifty: s.lifelines.fiftyFifty - 1 },
    }));
  };

  // Lifeline 2: Hint
  const useHint = () => {
    if (stats.lifelines.hint <= 0 || isAnswered || showHint) return;
    sounds.playLifeline();
    setShowHint(true);

    updateStats((s) => ({
      ...s,
      lifelines: { ...s.lifelines, hint: s.lifelines.hint - 1 },
    }));
  };

  // Lifeline 3: Time freeze / add time
  const useTimeFreeze = () => {
    if (stats.lifelines.timeFreeze <= 0 || isAnswered || !isTimed) return;
    sounds.playLifeline();
    setTimeLeft((prev) => prev + 20);

    updateStats((s) => ({
      ...s,
      lifelines: { ...s.lifelines, timeFreeze: s.lifelines.timeFreeze - 1 },
    }));
  };

  // Lifeline 4: Skip
  const useSkip = () => {
    if (stats.lifelines.skip <= 0 || isAnswered) return;
    sounds.playLifeline();

    updateStats((s) => ({
      ...s,
      lifelines: { ...s.lifelines, skip: s.lifelines.skip - 1 },
    }));

    handleNext();
  };

  // Lifeline 5: Double coins booster
  const useDoubleCoins = () => {
    if (stats.lifelines.doubleCoins <= 0 || isAnswered || doubleCoinsActive) return;
    sounds.playLifeline();
    setDoubleCoinsActive(true);

    updateStats((s) => ({
      ...s,
      lifelines: { ...s.lifelines, doubleCoins: s.lifelines.doubleCoins - 1 },
    }));
  };

  // Bookmark toggle
  const toggleBookmark = () => {
    sounds.playClick();
    updateStats((s) => {
      const exists = s.bookmarkedQuestionIds.includes(currentQ.id);
      const updated = exists
        ? s.bookmarkedQuestionIds.filter((id) => id !== currentQ.id)
        : [...s.bookmarkedQuestionIds, currentQ.id];
      return { ...s, bookmarkedQuestionIds: updated };
    });
  };

  if (!currentQ) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-lg text-amber-200">কোনো প্রশ্ন পাওয়া যায়নি।</p>
        <button
          onClick={onExit}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl"
        >
          ফিরে যান
        </button>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-amber-200">{title}</h2>
            {subtitle && (
              <p className="text-xs text-amber-300/80">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={toggleBookmark}
              title={isBookmarked ? 'বুকমার্ক থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
              className="p-2 rounded-lg bg-amber-900/50 hover:bg-amber-900 border border-amber-500/30 text-amber-300 transition-colors"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Exit button */}
            <button
              onClick={() => {
                sounds.playClick();
                onExit();
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-900/70 border border-amber-500/20 text-amber-200 transition-colors"
            >
              বেরিয়ে আসুন
            </button>
          </div>
        </div>

        {/* Progress bar & Question Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-amber-200/80 font-medium">
            <span>
              ধাঁধা নং: <strong className="text-amber-300 tabular-nums">{toBn(currentIndex + 1)}</strong> / {toBn(questions.length)}
            </span>
            <span>
              এই রাউন্ডে পয়েন্ট: <strong className="text-emerald-400 tabular-nums">{toBn(score + (isAlreadySolved ? 1 : 0))}</strong>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-amber-900/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Timed Bar if applicable */}
        {isTimed && !isAlreadySolved && (
          <div className="flex items-center justify-between pt-1 border-t border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>বাকি সময়:</span>
              <span className="tabular-nums text-sm font-extrabold text-amber-200">
                {toBn(timeLeft)} সেকেন্ড
              </span>
            </div>
            {streak > 1 && (
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {toBn(streak)}টি একনাগাড়ে সঠিক!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lifelines Bar (Disabled if already solved) */}
      {!isAlreadySolved && (
        <div className="bg-amber-950/60 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-amber-300/80 shrink-0 hidden sm:inline">
            লাইফলাইন:
          </span>

          <div className="flex items-center gap-2 w-full justify-between sm:justify-end">
            {/* 50:50 */}
            <button
              onClick={useFiftyFifty}
              disabled={isAnswered || stats.lifelines.fiftyFifty <= 0 || disabledOptions.length > 0}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                stats.lifelines.fiftyFifty > 0 && !isAnswered && disabledOptions.length === 0
                  ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-500/40 text-amber-200 active:scale-95'
                  : 'bg-amber-950/30 border-amber-600/10 text-amber-400/30 cursor-not-allowed'
              }`}
              title="দুটি ভুল অপশন দূর করুন"
            >
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>৫০-৫০</span>
              <span className="text-[10px] bg-amber-500/20 px-1 rounded tabular-nums">
                {toBn(stats.lifelines.fiftyFifty)}
              </span>
            </button>

            {/* Hint */}
            <button
              onClick={useHint}
              disabled={isAnswered || stats.lifelines.hint <= 0 || showHint}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                stats.lifelines.hint > 0 && !isAnswered && !showHint
                  ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-500/40 text-amber-200 active:scale-95'
                  : 'bg-amber-950/30 border-amber-600/10 text-amber-400/30 cursor-not-allowed'
              }`}
              title="সঠিক উত্তরের সংকেত জানুন"
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
              <span>ইঙ্গিত</span>
              <span className="text-[10px] bg-amber-500/20 px-1 rounded tabular-nums">
                {toBn(stats.lifelines.hint)}
              </span>
            </button>

            {/* Time Freeze (if timed) */}
            {isTimed && (
              <button
                onClick={useTimeFreeze}
                disabled={isAnswered || stats.lifelines.timeFreeze <= 0}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  stats.lifelines.timeFreeze > 0 && !isAnswered
                    ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-500/40 text-amber-200 active:scale-95'
                    : 'bg-amber-950/30 border-amber-600/10 text-amber-400/30 cursor-not-allowed'
                }`}
                title="+২০ সেকেন্ড যোগ করুন"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>+২০ সে</span>
                <span className="text-[10px] bg-amber-500/20 px-1 rounded tabular-nums">
                  {toBn(stats.lifelines.timeFreeze)}
                </span>
              </button>
            )}

            {/* Skip */}
            <button
              onClick={useSkip}
              disabled={isAnswered || stats.lifelines.skip <= 0}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                stats.lifelines.skip > 0 && !isAnswered
                  ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-500/40 text-amber-200 active:scale-95'
                  : 'bg-amber-950/30 border-amber-600/10 text-amber-400/30 cursor-not-allowed'
              }`}
              title="প্রশ্ন পরিবর্তন করুন"
            >
              <FastForward className="w-3.5 h-3.5 text-rose-400" />
              <span>স্কিপ</span>
              <span className="text-[10px] bg-amber-500/20 px-1 rounded tabular-nums">
                {toBn(stats.lifelines.skip)}
              </span>
            </button>

            {/* Double Coins */}
            <button
              onClick={useDoubleCoins}
              disabled={isAnswered || stats.lifelines.doubleCoins <= 0 || doubleCoinsActive}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                stats.lifelines.doubleCoins > 0 && !isAnswered && !doubleCoinsActive
                  ? 'bg-amber-900/60 hover:bg-amber-800 border-amber-500/40 text-amber-200 active:scale-95'
                  : doubleCoinsActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                  : 'bg-amber-950/30 border-amber-600/10 text-amber-400/30 cursor-not-allowed'
              }`}
              title="দ্বিগুণ কয়েন সক্রিয় করুন"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{doubleCoinsActive ? '২× সক্রিয়' : '২× কয়েন'}</span>
              <span className="text-[10px] bg-amber-500/20 px-1 rounded tabular-nums">
                {toBn(stats.lifelines.doubleCoins)}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-md space-y-6">
        {/* Category & Status Tags */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 text-amber-300">
            <span>{currentQ.category}</span>
            <span aria-hidden="true">·</span>
            <span>কঠিনতা: {currentQ.difficulty}</span>
          </div>

          {isAlreadySolved ? (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span>পূর্বে সমাধানকৃত (লোকাল স্টোরেজে সংরক্ষিত)</span>
            </span>
          ) : doubleCoinsActive ? (
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px] font-bold animate-pulse">
              ২× কয়েন বোনাস চলছে!
            </span>
          ) : null}
        </div>

        {/* Previously Solved Alert Banner */}
        {isAlreadySolved && (
          <div className="bg-emerald-950/70 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-100">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-emerald-200">
                  এই প্রশ্নটির সঠিক উত্তর আপনার লোকাল স্টোরেজে সেভ আছে!
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  আপনাকে আবার এটি উত্তর দেওয়ার কোনো প্রয়োজন নেই। সরাসরি পরবর্তী ধাঁধায় এগিয়ে যেতে পারেন।
                </p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-amber-100 leading-relaxed text-balance">
          {currentQ.question}
        </h3>

        {/* Hint Banner if active */}
        {showHint && (
          <div className="bg-amber-900/40 border border-yellow-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
            <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">ইঙ্গিত:</strong> {currentQ.hint}
            </div>
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((option, idx) => {
            const isDisabled = disabledOptions.includes(idx);
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.answerIndex;

            let btnStyle =
              'bg-amber-900/40 hover:bg-amber-900/70 border-amber-500/30 text-amber-100';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-md';
              } else if (isSelected) {
                btnStyle = 'bg-rose-700/90 border-rose-400 text-white font-bold shadow-md';
              } else {
                btnStyle = 'bg-amber-950/30 border-amber-600/20 text-amber-300/40 opacity-50';
              }
            } else if (isDisabled) {
              btnStyle = 'bg-amber-950/20 border-amber-600/10 text-amber-500/20 line-through opacity-30 cursor-not-allowed';
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isDisabled}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all duration-150 flex items-center justify-between gap-3 active:scale-[0.98] ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-200 shrink-0 tabular-nums">
                    {toBn(idx + 1)}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                    {isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-300 shrink-0" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Feedback after submission */}
        {isAnswered && (
          <div className="pt-4 border-t border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300">
                {feedbackMsg}
              </span>
              <span className="text-xs text-amber-200/80">
                সঠিক উত্তর: <strong className="text-emerald-400">{currentQ.options[currentQ.answerIndex]}</strong>
              </span>
            </div>

            {currentQ.explanation && (
              <p className="text-xs sm:text-sm text-amber-100/90 bg-amber-900/30 p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                {currentQ.explanation}
              </p>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-98"
            >
              <span>{currentIndex + 1 < questions.length ? 'পরবর্তী ধাঁধা' : 'ফলাফল দেখুন'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
