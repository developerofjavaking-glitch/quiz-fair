import React from 'react';
import { GameMode, UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { ASSETS } from '../assets';
import { AVATARS } from '../data/storeData';
import {
  Compass,
  Layers,
  Timer,
  Calendar,
  Disc,
  Users2,
  BookOpen,
  Trophy,
  Flame,
  ArrowRight,
  Gift,
} from 'lucide-react';

interface HomeViewProps {
  setMode: (mode: GameMode) => void;
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onSelectCategory?: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setMode,
  stats,
  updateStats,
}) => {
  const currentAvatar = AVATARS.find((a) => a.id === stats.selectedAvatar) || AVATARS[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const canClaimDaily = stats.lastDailyClaimDate !== todayStr;

  const handleClaimDaily = () => {
    if (!canClaimDaily) return;
    sounds.playCoin();
    fireConfetti();

    const streakBonus = Math.min(stats.dailyStreak * 25, 200);
    const reward = 50 + streakBonus;

    updateStats((prev) => ({
      ...prev,
      coins: prev.coins + reward,
      lastDailyClaimDate: todayStr,
      dailyStreak: prev.dailyStreak + 1,
    }));
  };

  const gameModes = [
    {
      mode: 'LEVELS' as GameMode,
      title: 'মেলা পরিক্রমা',
      subtitle: `লেভেল ${toBn(stats.unlockedLevel)} / ১০০ ধাপ`,
      desc: 'ধাপে ধাপে এগিয়ে যান, ৩ স্টার রেটিং ও মেগা কয়েন জিতে মেলার বিজয়ী হোন।',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      badge: 'জনপ্রিয় মোড',
    },
    {
      mode: 'CATEGORY_SELECT' as GameMode,
      title: 'বিষয়ভিত্তিক মেলা',
      subtitle: '১০টি বিশেষ বিষয়',
      desc: 'গ্রামীণ ধাঁধা, সাধারণ জ্ঞান, মজার বিজ্ঞান, সাহিত্য, প্রবাদ বা গণিত ধাঁধা খেলুন।',
      icon: Layers,
      color: 'from-emerald-500 to-teal-600',
      badge: '১০০০+ ধাঁধা',
    },
    {
      mode: 'TIME_RUSH' as GameMode,
      title: 'দ্রুত চ্যালেঞ্জ',
      subtitle: '৬০ সেকেন্ডের ঝড়',
      desc: 'সময়ের সাথে পাল্লা দিয়ে একের পর এক সঠিক উত্তর দিন। কম্বো বোনাস লাভ করুন!',
      icon: Timer,
      color: 'from-rose-500 to-pink-600',
      badge: `সেরা: ${toBn(stats.bestTimeRushScore)}`,
    },
    {
      mode: 'DAILY_CHALLENGE' as GameMode,
      title: 'দৈনিক ধাঁধা',
      subtitle: 'আজকের বিশেষ রহস্য',
      desc: 'প্রতিদিন নতুন ১টি বুদ্ধিদীপ্ত ধাঁধা সমাধান করে ১০০ কয়েন বোনাস লুফে নিন।',
      icon: Calendar,
      color: 'from-indigo-500 to-blue-600',
      badge: '১০০ কয়েন',
    },
    {
      mode: 'SPIN_WHEEL' as GameMode,
      title: 'ভাগ্যের চাকা',
      subtitle: 'লটারি স্পিন হুইল',
      desc: 'রঙিন চাকা ঘুরিয়ে জিতুন কয়েন, লাইফলাইন ও অমূল্য উপহার!',
      icon: Disc,
      color: 'from-purple-500 to-indigo-600',
      badge: 'দৈনিক উপহার',
    },
    {
      mode: 'TWO_PLAYER' as GameMode,
      title: 'বন্ধুর দ্বৈত লড়াই',
      subtitle: '২ খেলোয়াড় একই ডিভাইসে',
      desc: 'একই স্ক্রিনে মুখোমুখি বসে বন্ধুর সাথে বুদ্ধি ও গতির দারুণ প্রতিযোগিতা।',
      icon: Users2,
      color: 'from-amber-600 to-red-600',
      badge: 'দ্বৈত খেলা',
    },
    {
      mode: 'RIDDLE_BOOK' as GameMode,
      title: 'ধাঁধার খাতা',
      subtitle: '১,০৫০টি কুইজের ভাণ্ডার',
      desc: 'যেকোনো ধাঁধা সার্চ করুন, উত্তর দেখুন বা বুকমার্ক করে পরিবারে কুইজ ধরুন!',
      icon: BookOpen,
      color: 'from-cyan-600 to-blue-700',
      badge: 'পূর্ণ লাইব্রেরি',
    },
    {
      mode: 'ACHIEVEMENTS' as GameMode,
      title: 'অর্জন ও খেতাব',
      subtitle: 'পদক ও পুরস্কার',
      desc: 'মাইলফলক জয় করে কয়েন সংগ্রহ করুন এবং অনন্য খেতাবধারী হোন।',
      icon: Trophy,
      color: 'from-yellow-500 to-amber-600',
      badge: `${toBn(stats.achievementsClaimed.length)} টি আনলক`,
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-500/30 bg-amber-950 text-white min-h-[280px] sm:min-h-[340px] flex items-end p-6 sm:p-10">
        <img
          src={ASSETS.heroBanner}
          alt="ধাঁধার মেলা প্রাঙ্গণ"
          className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen scale-105 transition-transform duration-700 hover:scale-100"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <span>বাঙালির লোকজ উৎসব</span>
              <span aria-hidden="true">·</span>
              <span>১,০৫০+ প্রশ্ন ও ধাঁধার মেগা সংগ্রহ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance drop-shadow-sm">
              বুদ্ধি আর মেধার মহোৎসব <span className="text-amber-400">‘ধাঁধার মেলা’</span>
            </h1>

            <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-normal">
              গ্রামীণ ধাঁধা, সাধারণ জ্ঞান, মজার বিজ্ঞান ও সাহিত্যের এক বিশাল উৎসব প্রাঙ্গণ। সব বয়সের মানুষের আনন্দের মিলনমেলা!
            </p>
          </div>

          {/* Quick Hero Play CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setMode('LEVELS');
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 whitespace-nowrap active:scale-95"
            >
              <span>খেলা শুরু করুন</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Reward & User Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="bg-amber-950/70 border border-amber-500/25 rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-amber-50 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md shrink-0">
            {currentAvatar.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base truncate text-amber-100">{currentAvatar.name}</h2>
              <span className="text-xs text-amber-300 font-medium">{currentAvatar.title}</span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5">
              মোট সঠিক সমাধান: <span className="text-amber-300 font-bold tabular-nums">{toBn(stats.totalCorrect)}</span> টি
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-amber-300/80">
              <span>লেভেল {toBn(stats.unlockedLevel)}</span>
              <span>·</span>
              <span>স্ট্রিক {toBn(stats.dailyStreak)} দিন</span>
            </div>
          </div>
        </div>

        {/* Daily Bonus Card */}
        <div className="md:col-span-2 bg-gradient-to-r from-orange-950/80 to-amber-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-50 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-amber-200">দৈনিক মেলা উপহার</h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  +{toBn(50 + Math.min(stats.dailyStreak * 25, 200))} কয়েন
                </span>
              </div>
              <p className="text-xs text-amber-100/70 mt-0.5">
                প্রতিদিন লগইন করে কয়েন ভাণ্ডার সমৃদ্ধ করুন। স্ট্রিক ধরে রাখলে মিলবে বাড়তি কয়েন!
              </p>
            </div>
          </div>

          <button
            onClick={handleClaimDaily}
            disabled={!canClaimDaily}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
              canClaimDaily
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm active:scale-95'
                : 'bg-amber-900/40 text-amber-300/50 border border-amber-600/20 cursor-not-allowed'
            }`}
          >
            {canClaimDaily ? 'উপহার সংগ্রহ করুন' : 'আজকের বোনাস নেওয়া হয়েছে ✓'}
          </button>
        </div>
      </div>

      {/* Main Game Modes Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
              মেলার খেলা ও আয়োজন
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-amber-200/70">
              আপনার পছন্দের খেলা নির্বাচন করে বুদ্ধি ও জ্ঞানের আনন্দ উপভোগ করুন
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {gameModes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.mode}
                onClick={() => {
                  sounds.playClick();
                  setMode(m.mode);
                }}
                className="group relative bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/25 hover:border-amber-400/50 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between text-amber-50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {m.title}
                  </h3>
                  <div className="text-xs font-medium text-amber-400/90 mb-2">
                    {m.subtitle}
                  </div>
                  <p className="text-xs text-amber-100/70 leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-semibold text-amber-300">
                  <span>খেলুন</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
