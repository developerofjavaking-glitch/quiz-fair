/**
 * @license
 * Dhadhar Mela (ধাঁধার মেলা) - Comprehensive 1000+ Bangla Quizzes & Riddles
 */

import React, { useState, useEffect } from 'react';
import { GameMode, UserStats, ThemeId } from './types';
import { INITIAL_USER_STATS, THEMES } from './data/storeData';
import { ALL_QUESTIONS, Question } from './data/questions';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { LevelsView } from './components/LevelsView';
import { CategorySelectView } from './components/CategorySelectView';
import { QuizBoard } from './components/QuizBoard';
import { TimeRushView } from './components/TimeRushView';
import { DailyChallengeView } from './components/DailyChallengeView';
import { SpinWheelView } from './components/SpinWheelView';
import { TwoPlayerView } from './components/TwoPlayerView';
import { StoreView } from './components/StoreView';
import { RiddleBookView } from './components/RiddleBookView';
import { AchievementsView } from './components/AchievementsView';
import { sounds } from './utils/sound';
import { toBn } from './utils/bengali';
import { fireConfetti } from './utils/confetti';
import { loadUserStats, saveUserStats } from './utils/storage';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Compass, Layers, Store, BookOpen } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());

  const [currentMode, setCurrentMode] = useState<GameMode>('HOME');
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [activeLevelNum, setActiveLevelNum] = useState<number | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);

  // Modal for Level Completion
  const [levelSummary, setLevelSummary] = useState<{
    score: number;
    total: number;
    coinsEarned: number;
    stars: number;
    levelNum: number;
  } | null>(null);

  // Sync stats to localStorage immediately on every change
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  const updateStats = (updater: (prev: UserStats) => UserStats) => {
    setStats((prev) => {
      const next = updater(prev);
      saveUserStats(next);
      return next;
    });
  };

  // Find active theme configuration
  const currentTheme =
    THEMES.find((t) => t.id === stats.selectedTheme) || THEMES[0];

  // Start Level Play
  const handleStartLevel = (levelNum: number) => {
    sounds.playClick();
    setActiveLevelNum(levelNum);
    // Slice 10 questions for this level
    const startIndex = ((levelNum - 1) * 10) % (ALL_QUESTIONS.length - 10);
    const levelQuestions = ALL_QUESTIONS.slice(startIndex, startIndex + 10);
    setActiveQuizQuestions(levelQuestions);
    setCurrentMode('PLAY_LEVEL');
  };

  // Start Category Play - Prioritize questions user hasn't solved yet
  const handleStartCategory = (catName: string) => {
    sounds.playClick();
    setActiveCategoryName(catName);
    // Filter questions by category
    const catQuestions = ALL_QUESTIONS.filter((q) => q.category === catName);
    const unsolved = catQuestions.filter((q) => !stats.solvedQuestionIds.includes(q.id));
    // Prioritize unsolved so the user doesn't have to re-answer already solved questions
    const pool = unsolved.length >= 10 ? unsolved : [...unsolved, ...catQuestions.filter(q => stats.solvedQuestionIds.includes(q.id))];
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    setActiveQuizQuestions(shuffled);
    setCurrentMode('PLAY_CATEGORY');
  };

  // On Level Finish
  const handleFinishLevel = (result: { score: number; total: number; coinsEarned: number }) => {
    if (!activeLevelNum) return;

    let stars = 0;
    if (result.score >= 8) stars = 3;
    else if (result.score >= 6) stars = 2;
    else if (result.score >= 4) stars = 1;

    // Update level stars and unlock next level if passed
    updateStats((prev) => {
      const currentBestStars = prev.levelStars[activeLevelNum] || 0;
      const newLevelStars = {
        ...prev.levelStars,
        [activeLevelNum]: Math.max(currentBestStars, stars),
      };

      let newUnlocked = prev.unlockedLevel;
      if (stars >= 1 && activeLevelNum === prev.unlockedLevel && activeLevelNum < 100) {
        newUnlocked = prev.unlockedLevel + 1;
      }

      return {
        ...prev,
        levelStars: newLevelStars,
        unlockedLevel: newUnlocked,
      };
    });

    setLevelSummary({
      score: result.score,
      total: result.total,
      coinsEarned: result.coinsEarned,
      stars: stars,
      levelNum: activeLevelNum,
    });
  };

  // On Category Finish
  const handleFinishCategory = (result: { score: number; total: number; coinsEarned: number }) => {
    sounds.playFanfare();
    fireConfetti();
    setCurrentMode('CATEGORY_SELECT');
  };

  const handleNextLevelFromSummary = () => {
    if (!levelSummary) return;
    const nextLvl = levelSummary.levelNum + 1;
    setLevelSummary(null);
    if (nextLvl <= 100) {
      handleStartLevel(nextLvl);
    } else {
      setCurrentMode('LEVELS');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Hind_Siliguri',sans-serif] bg-gradient-to-b ${
        currentTheme.id === 'green_bangla'
          ? 'from-emerald-950 via-teal-950 to-slate-950 text-emerald-50'
          : currentTheme.id === 'night_carnival'
          ? 'from-slate-950 via-indigo-950 to-purple-950 text-indigo-50'
          : currentTheme.id === 'royal_durbar'
          ? 'from-purple-950 via-violet-950 to-slate-950 text-amber-50'
          : 'from-amber-950 via-orange-950 to-stone-950 text-amber-50'
      }`}
    >
      {/* Top Bar Navigation */}
      <Navbar
        currentMode={currentMode}
        setMode={setCurrentMode}
        stats={stats}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentMode === 'HOME' && (
          <HomeView
            setMode={setCurrentMode}
            stats={stats}
            updateStats={updateStats}
            onSelectCategory={handleStartCategory}
          />
        )}

        {currentMode === 'LEVELS' && (
          <LevelsView
            stats={stats}
            onSelectLevel={handleStartLevel}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'PLAY_LEVEL' && activeLevelNum && (
          <QuizBoard
            questions={activeQuizQuestions}
            title={`মেলা পরিক্রমা: ধাপ ${toBn(activeLevelNum)}`}
            subtitle="১০টি ধাঁধার মধ্যে কমপক্ষে ৪টি সঠিক উত্তর দিয়ে পরবর্তী ধাপ আনলক করুন"
            onFinish={handleFinishLevel}
            onExit={() => setCurrentMode('LEVELS')}
            stats={stats}
            updateStats={updateStats}
            isTimed={true}
            timeLimit={30}
          />
        )}

        {currentMode === 'CATEGORY_SELECT' && (
          <CategorySelectView
            onSelectCategory={handleStartCategory}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'PLAY_CATEGORY' && activeCategoryName && (
          <QuizBoard
            questions={activeQuizQuestions}
            title={`বিষয়: ${activeCategoryName}`}
            subtitle="১০টি বিশেষ ধাঁধা ও কুইজের মজাদার রাউন্ড"
            onFinish={handleFinishCategory}
            onExit={() => setCurrentMode('CATEGORY_SELECT')}
            stats={stats}
            updateStats={updateStats}
            isTimed={false}
          />
        )}

        {currentMode === 'TIME_RUSH' && (
          <TimeRushView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'DAILY_CHALLENGE' && (
          <DailyChallengeView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'SPIN_WHEEL' && (
          <SpinWheelView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'TWO_PLAYER' && (
          <TwoPlayerView onBack={() => setCurrentMode('HOME')} />
        )}

        {currentMode === 'STORE' && (
          <StoreView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'RIDDLE_BOOK' && (
          <RiddleBookView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}

        {currentMode === 'ACHIEVEMENTS' && (
          <AchievementsView
            stats={stats}
            updateStats={updateStats}
            onBack={() => setCurrentMode('HOME')}
          />
        )}
      </main>

      {/* Level Summary Completion Modal */}
      {levelSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-amber-950 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl text-amber-50">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300">
                ধাপ {toBn(levelSummary.levelNum)} সমাপ্ত!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-100">
                {levelSummary.stars >= 1 ? 'দারুণ সাফল্য!' : 'আরেকটু চেষ্টা প্রয়োজন!'}
              </h2>
            </div>

            {/* Stars Won */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 ${
                    starIdx <= levelSummary.stars
                      ? 'fill-yellow-400 text-yellow-400 scale-110'
                      : 'text-amber-700/40'
                  } transition-all`}
                />
              ))}
            </div>

            {/* Score & Coins Earned */}
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
              <div className="bg-amber-900/50 border border-amber-500/20 p-3 rounded-xl">
                <span className="text-[11px] text-amber-300 block">সঠিক উত্তর</span>
                <span className="text-xl font-black text-emerald-400 tabular-nums">
                  {toBn(levelSummary.score)} / {toBn(levelSummary.total)}
                </span>
              </div>
              <div className="bg-amber-900/50 border border-amber-500/20 p-3 rounded-xl">
                <span className="text-[11px] text-amber-300 block">অর্জিত কয়েন</span>
                <span className="text-xl font-black text-yellow-400 tabular-nums">
                  +{toBn(levelSummary.coinsEarned)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 pt-2">
              {levelSummary.stars >= 1 ? (
                <button
                  onClick={handleNextLevelFromSummary}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>পরবর্তী ধাপে যান</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLevelSummary(null);
                    handleStartLevel(levelSummary.levelNum);
                  }}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>আবার চেষ্টা করুন</span>
                </button>
              )}

              <button
                onClick={() => {
                  setLevelSummary(null);
                  setCurrentMode('LEVELS');
                }}
                className="w-full py-2.5 bg-amber-900/60 hover:bg-amber-900 text-amber-200 text-xs font-bold rounded-xl border border-amber-500/30 transition-colors"
              >
                লেভেল তালিকায় ফিরে যান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-amber-600/20 py-6 mb-16 md:mb-0 text-center text-xs text-amber-300/70 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ধাঁধার মেলা © ২০২৬ · ১,০৫০+ বাংলা ধাঁধা ও কুইজ</span>
          <span>গ্রাম-বাংলা ও বিশ্ব জ্ঞানের বর্ণাঢ্য উৎসব</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-amber-950/95 backdrop-blur-md border-t border-amber-500/30 px-2 py-1.5 flex items-center justify-around shadow-lg text-amber-200">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('HOME');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
            currentMode === 'HOME' ? 'text-amber-300 bg-amber-500/20' : 'text-amber-200/70'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>প্রাঙ্গণ</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('LEVELS');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
            currentMode === 'LEVELS' || currentMode === 'PLAY_LEVEL'
              ? 'text-amber-300 bg-amber-500/20'
              : 'text-amber-200/70'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>পরিক্রমা</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('CATEGORY_SELECT');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
            currentMode === 'CATEGORY_SELECT' || currentMode === 'PLAY_CATEGORY'
              ? 'text-amber-300 bg-amber-500/20'
              : 'text-amber-200/70'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>বিষয়</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('STORE');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
            currentMode === 'STORE' ? 'text-amber-300 bg-amber-500/20' : 'text-amber-200/70'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>দোকান</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('RIDDLE_BOOK');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold py-1 px-2 rounded-lg transition-colors ${
            currentMode === 'RIDDLE_BOOK' ? 'text-amber-300 bg-amber-500/20' : 'text-amber-200/70'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>খাতা</span>
        </button>
      </nav>
    </div>
  );
}
