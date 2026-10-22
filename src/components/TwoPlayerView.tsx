import React, { useState } from 'react';
import { ALL_QUESTIONS, Question } from '../data/questions';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import {
  ChevronLeft,
  Users2,
  Trophy,
  Swords,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';

interface TwoPlayerViewProps {
  onBack: () => void;
}

export const TwoPlayerView: React.FC<TwoPlayerViewProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'FINISHED'>('SETUP');
  const [p1Name, setP1Name] = useState('খেলোয়াড় ১');
  const [p2Name, setP2Name] = useState('খেলোয়াড় ২');
  const [roundsCount, setRoundsCount] = useState<number>(6); // 6 questions (3 each)

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startDuel = () => {
    sounds.playClick();
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, roundsCount);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setP1Score(0);
    setP2Score(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameState('PLAYING');
  };

  const currentPlayer = currentQIndex % 2 === 0 ? 1 : 2;
  const currentPlayerName = currentPlayer === 1 ? p1Name : p2Name;
  const currentQ = questions[currentQIndex];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.answerIndex;
    if (isCorrect) {
      sounds.playCorrect();
      if (currentPlayer === 1) {
        setP1Score((s) => s + 1);
      } else {
        setP2Score((s) => s + 1);
      }
    } else {
      sounds.playWrong();
    }
  };

  const handleNextTurn = () => {
    sounds.playClick();
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameState('FINISHED');
      sounds.playFanfare();
      fireConfetti();
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
              <Users2 className="w-6 h-6 text-orange-400" />
              <span>বন্ধুর সাথে দ্বৈত লড়াই</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              একই ডিভাইসে ২ জন সামনাসামনি কুইজের প্রতিযোগিতা!
            </p>
          </div>
        </div>
      </div>

      {/* Setup screen */}
      {gameState === 'SETUP' && (
        <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <Swords className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-amber-200">লড়াইয়ের প্রস্তুতি</h2>
            <p className="text-xs sm:text-sm text-amber-100/80">
              দুজন খেলোয়াড় পর্যায়ক্রমে একটি করে ধাঁধার উত্তর দিবেন। যার পয়েন্ট বেশি হবে সে-ই বিজয়ী!
            </p>
          </div>

          {/* Player Names Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-400 block">
                খেলোয়াড় ১ (সবুজ দল):
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full bg-amber-900/40 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm text-emerald-200 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-rose-400 block">
                খেলোয়াড় ২ (লাল দল):
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full bg-amber-900/40 border border-rose-500/40 rounded-xl px-4 py-2.5 text-sm text-rose-200 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Rounds count */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-amber-300 block">
              মোট রাউন্ড সংখ্যা:
            </label>
            <div className="flex gap-2">
              {[6, 10, 14].map((count) => (
                <button
                  key={count}
                  onClick={() => setRoundsCount(count)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                    roundsCount === count
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-amber-900/40 border-amber-500/20 text-amber-200 hover:bg-amber-900/70'
                  }`}
                >
                  {toBn(count)} টি ধাঁধা
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startDuel}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-base rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Swords className="w-5 h-5" />
            <span>লড়াই শুরু হোক!</span>
          </button>
        </div>
      )}

      {/* Playing screen */}
      {gameState === 'PLAYING' && currentQ && (
        <div className="space-y-5">
          {/* Scoreboard Bar */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3.5 rounded-2xl border transition-all text-center ${
                currentPlayer === 1
                  ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50 shadow-md'
                  : 'bg-amber-950/40 border-amber-600/20 opacity-70'
              }`}
            >
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <span>{p1Name}</span>
                {currentPlayer === 1 && <span className="animate-pulse">● পালা</span>}
              </div>
              <div className="text-3xl font-black text-white tabular-nums mt-0.5">
                {toBn(p1Score)}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border transition-all text-center ${
                currentPlayer === 2
                  ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-400/50 shadow-md'
                  : 'bg-amber-950/40 border-amber-600/20 opacity-70'
              }`}
            >
              <div className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1">
                <span>{p2Name}</span>
                {currentPlayer === 2 && <span className="animate-pulse">● পালা</span>}
              </div>
              <div className="text-3xl font-black text-white tabular-nums mt-0.5">
                {toBn(p2Score)}
              </div>
            </div>
          </div>

          {/* Current Question Box */}
          <div className="bg-amber-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl space-y-6">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-amber-500/20 pb-2.5">
              <span>ধাঁধা {toBn(currentQIndex + 1)} / {toBn(roundsCount)}</span>
              <span className={`font-bold ${currentPlayer === 1 ? 'text-emerald-400' : 'text-rose-400'}`}>
                এখন উত্তর দিচ্ছেন: {currentPlayerName}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-amber-100 leading-snug">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isAnsCorrect = idx === currentQ.answerIndex;

                let style = 'bg-amber-900/40 hover:bg-amber-900/70 border-amber-500/30 text-amber-100';

                if (isAnswered) {
                  if (isAnsCorrect) {
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
                        {isAnsCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                        {isSelected && !isAnsCorrect && <XCircle className="w-5 h-5 text-rose-300" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Turn button */}
            {isAnswered && (
              <div className="pt-3 border-t border-amber-500/20">
                <button
                  onClick={handleNextTurn}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{currentQIndex + 1 < questions.length ? 'পরবর্তী খেলোয়াড়ের পালা' : 'চূড়ান্ত ফলাফল দেখুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary */}
      {gameState === 'FINISHED' && (
        <div className="bg-amber-950/85 border border-amber-500/30 rounded-3xl p-8 text-center text-amber-50 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-black text-amber-200">
              {p1Score > p2Score
                ? `${p1Name} বিজয়ী!`
                : p2Score > p1Score
                ? `${p2Name} বিজয়ী!`
                : 'অবিশ্বাস্য লড়াই—খেলা ড্র হয়েছে!'}
            </h2>
            <p className="text-sm text-amber-100/80">
              দুজনেই চমৎকার মেধা ও সাহসিকতা প্রদর্শন করেছেন!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-2xl">
              <span className="text-xs text-emerald-300 font-bold block">{p1Name}</span>
              <span className="text-3xl font-black text-white tabular-nums">{toBn(p1Score)}</span>
            </div>
            <div className="bg-rose-950/60 border border-rose-500/30 p-4 rounded-2xl">
              <span className="text-xs text-rose-300 font-bold block">{p2Name}</span>
              <span className="text-3xl font-black text-white tabular-nums">{toBn(p2Score)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startDuel}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>পুনরায় লড়াই করুন</span>
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
