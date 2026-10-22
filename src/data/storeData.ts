import { AvatarItem, ThemeItem, Achievement, UserStats } from '../types';

export const INITIAL_USER_STATS: UserStats = {
  coins: 150, // Initial generous starter coins
  unlockedLevel: 1,
  levelStars: {},
  lifelines: {
    fiftyFifty: 3,
    hint: 3,
    timeFreeze: 2,
    skip: 2,
    doubleCoins: 1,
  },
  selectedAvatar: 'baul',
  selectedTheme: 'classic_mela',
  unlockedAvatars: ['baul'],
  unlockedThemes: ['classic_mela'],
  bookmarkedQuestionIds: [],
  solvedQuestionIds: [],
  answeredQuestions: {},
  purchaseHistory: [],
  lastDailyClaimDate: '',
  dailyStreak: 1,
  totalCorrect: 0,
  totalWrong: 0,
  bestTimeRushScore: 0,
  achievementsClaimed: [],
  lastSpinDate: '',
};

export const AVATARS: AvatarItem[] = [
  {
    id: 'baul',
    name: 'মন বাউল',
    title: 'গ্রামের সুরকার',
    price: 0,
    unlocked: true,
    emoji: '🎸',
    description: 'একতারা হাতে গ্রামীণ ধাঁধার মধুর সুরে মেতে থাকা বাউল।',
  },
  {
    id: 'detective',
    name: 'গোয়েন্দা তোপসে',
    title: 'রহস্য সন্ধানী',
    price: 150,
    unlocked: false,
    emoji: '🕵️‍♂️',
    description: 'তীক্ষ্ণ নজর ও বুদ্ধি দিয়ে যে কোনো জটিল ধাঁধার গিঁট খুলে ফেলে।',
  },
  {
    id: 'samrat',
    name: 'মেলা সম্রাট',
    title: 'ধাঁধার অধিপতি',
    price: 250,
    unlocked: false,
    emoji: '👑',
    description: 'রাজকীয় মেজাজে কুইজের মঞ্চ কাঁপিয়ে তোলার অধিকারী।',
  },
  {
    id: 'princess',
    name: 'চতুরা রাজকুমারী',
    title: 'বুদ্ধিমতী নায়িকা',
    price: 300,
    unlocked: false,
    emoji: '👸',
    description: 'সৌন্দর্যের সাথে অগাধ প্রজ্ঞা ও চতুর বুদ্ধির মেলবন্ধন।',
  },
  {
    id: 'pandit',
    name: 'বিজ্ঞ পণ্ডিত',
    title: 'মহাজ্ঞানী গুরু',
    price: 400,
    unlocked: false,
    emoji: '📜',
    description: 'প্রাচীন পুঁথি ও শাস্ত্রের অগাধ জ্ঞানের আধার।',
  },
  {
    id: 'jadukor',
    name: 'মেলা জাদুকর',
    title: 'মায়াবী শিল্পী',
    price: 500,
    unlocked: false,
    emoji: '🧙‍♂️',
    description: 'চোখের পলকে সঠিক উত্তরের সংকেত খুঁজে নেওয়ার মায়াজাল।',
  },
  {
    id: 'fighter',
    name: 'সোনার বীর',
    title: 'অপরাজেয় সেনাপতি',
    price: 750,
    unlocked: false,
    emoji: '🛡️',
    description: 'কোনো পরাজয় নেই যার ডায়েরিতে, সকল চ্যালেঞ্জে বিজয়ী।',
  },
];

export const THEMES: ThemeItem[] = [
  {
    id: 'classic_mela',
    name: 'বৈশাখী মেলা',
    price: 0,
    unlocked: true,
    bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
    cardBg: 'bg-amber-950/60 border-amber-500/30 text-amber-50',
    accentColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    description: 'বাঙালির লোকজ উৎসবের উষ্ণ লাল-কমলা রঙের মেলাময় আমেজ।',
  },
  {
    id: 'green_bangla',
    name: 'শ্যামল বাংলা',
    price: 200,
    unlocked: false,
    bgGradient: 'from-emerald-700 via-teal-700 to-green-900',
    cardBg: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-50',
    accentColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    description: 'সবুজ গ্রাম, ধানক্ষেত ও নদীমাতৃক রূপসী বাংলার স্নিগ্ধ ছোঁয়া।',
  },
  {
    id: 'night_carnival',
    name: 'রাতের মেলা',
    price: 300,
    unlocked: false,
    bgGradient: 'from-slate-900 via-indigo-950 to-purple-950',
    cardBg: 'bg-slate-900/70 border-indigo-500/30 text-indigo-50',
    accentColor: 'bg-indigo-500 hover:bg-indigo-400 text-white',
    description: 'রাতের আলোঝলমল মেলা ও রঙিন ফানুসের মায়াবী নিয়ন জগত।',
  },
  {
    id: 'royal_durbar',
    name: 'রাজদরবার',
    price: 450,
    unlocked: false,
    bgGradient: 'from-purple-900 via-violet-950 to-amber-950',
    cardBg: 'bg-purple-950/70 border-amber-500/30 text-amber-100',
    accentColor: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
    description: 'রাজকীয় স্বর্ণখচিত আভিজাত্য ও ঐতিহ্যের ঝলকানি।',
  },
];

export interface StoreItem {
  id: string;
  name: string;
  category: 'lifeline';
  type: keyof UserStats['lifelines'];
  amount: number;
  price: number;
  iconName: string;
  description: string;
  benefit: string;
}

export const STORE_LIFELINES: StoreItem[] = [
  {
    id: 'pack_fifty_fifty',
    name: '৫০-৫০ লাইফলাইন (৩টি)',
    category: 'lifeline',
    type: 'fiftyFifty',
    amount: 3,
    price: 80,
    iconName: 'Percent',
    description: 'দুটি ভুল অপশন দূর করে দেয়',
    benefit: 'কঠিন প্রশ্নে ৫০% নিশ্চিত সুযোগ',
  },
  {
    id: 'pack_hint',
    name: 'সংকেত বা ইঙ্গিত (৩টি)',
    category: 'lifeline',
    type: 'hint',
    amount: 3,
    price: 60,
    iconName: 'Lightbulb',
    description: 'সঠিক উত্তরের গোপন ক্লু উন্মোচন করে',
    benefit: 'সঠিক উত্তরের পথ সুগম করে',
  },
  {
    id: 'pack_freeze',
    name: 'সময় ফ্রিজ (২টি)',
    category: 'lifeline',
    type: 'timeFreeze',
    amount: 2,
    price: 50,
    iconName: 'Clock',
    description: 'টাইমারে আরও ২০ সেকেন্ড যোগ করে',
    benefit: 'দ্রুত চ্যালেঞ্জে চিন্তা করার সময় দেয়',
  },
  {
    id: 'pack_skip',
    name: 'প্রশ্ন বদল / স্কিপ (২টি)',
    category: 'lifeline',
    type: 'skip',
    amount: 2,
    price: 90,
    iconName: 'FastForward',
    description: 'কোনো শাস্তি ছাড়াই নতুন প্রশ্ন নিয়ে আসে',
    benefit: 'অজানা কঠিন প্রশ্নে জীবন বাঁচায়',
  },
  {
    id: 'pack_double_coins',
    name: '২ গুণ কয়েন বুস্টার (২টি)',
    category: 'lifeline',
    type: 'doubleCoins',
    amount: 2,
    price: 100,
    iconName: 'Sparkles',
    description: 'পরবর্তী সঠিক উত্তরে ডাবল কয়েন লাভ',
    benefit: 'ঝটপট কয়েন বাড়ানোর দারুণ সুযোগ',
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'প্রথম বিজয়',
    description: 'যেকোনো ১টি কুইজের সঠিক উত্তর দিন',
    icon: 'Trophy',
    rewardCoins: 30,
    progress: (s) => ({
      current: Math.min(s.totalCorrect, 1),
      max: 1,
      completed: s.totalCorrect >= 1,
    }),
  },
  {
    id: 'riddle_10',
    title: 'ধাঁধা সন্ধানী',
    description: 'মোট ১০টি ধাঁধার সঠিক সমাধান করুন',
    icon: 'Award',
    rewardCoins: 50,
    progress: (s) => ({
      current: Math.min(s.totalCorrect, 10),
      max: 10,
      completed: s.totalCorrect >= 10,
    }),
  },
  {
    id: 'riddle_50',
    title: 'ধাঁধার পণ্ডিত',
    description: 'মোট ৫০টি ধাঁধার সফল সমাধান করুন',
    icon: 'Medal',
    rewardCoins: 150,
    progress: (s) => ({
      current: Math.min(s.totalCorrect, 50),
      max: 50,
      completed: s.totalCorrect >= 50,
    }),
  },
  {
    id: 'riddle_100',
    title: 'শত ধাঁধার বীর',
    description: 'মোট ১০০টি ধাঁধার সঠিক উত্তর দিন',
    icon: 'Crown',
    rewardCoins: 350,
    progress: (s) => ({
      current: Math.min(s.totalCorrect, 100),
      max: 100,
      completed: s.totalCorrect >= 100,
    }),
  },
  {
    id: 'level_5',
    title: 'মেলা পরিব্রাজক',
    description: 'পরিক্রমা মোডে লেভেল ৫ অতিক্রম করুন',
    icon: 'MapPin',
    rewardCoins: 100,
    progress: (s) => ({
      current: Math.min(s.unlockedLevel, 5),
      max: 5,
      completed: s.unlockedLevel >= 5,
    }),
  },
  {
    id: 'level_10',
    title: 'মেলা অধিপতি',
    description: 'পরিক্রমা মোডে লেভেল ১০ সফলভাবে পার করুন',
    icon: 'Flame',
    rewardCoins: 250,
    progress: (s) => ({
      current: Math.min(s.unlockedLevel, 10),
      max: 10,
      completed: s.unlockedLevel >= 10,
    }),
  },
  {
    id: 'timerush_8',
    title: 'বিদ্যুৎ গতি',
    description: 'দ্রুত চ্যালেঞ্জে এক রাউন্ডে ৮টি সঠিক উত্তর দিন',
    icon: 'Zap',
    rewardCoins: 120,
    progress: (s) => ({
      current: Math.min(s.bestTimeRushScore, 8),
      max: 8,
      completed: s.bestTimeRushScore >= 8,
    }),
  },
  {
    id: 'coin_500',
    title: 'ধাঁধার ধনকুবের',
    description: 'ভাণ্ডারে মোট ৫০০ কয়েন সঞ্চয় করুন',
    icon: 'Coins',
    rewardCoins: 150,
    progress: (s) => ({
      current: Math.min(s.coins, 500),
      max: 500,
      completed: s.coins >= 500,
    }),
  },
  {
    id: 'bookmark_5',
    title: 'ধাঁধার সংগ্রাহক',
    description: 'খাতায় ৫টি প্রিয় ধাঁধা বুকমার্ক করে রাখুন',
    icon: 'Bookmark',
    rewardCoins: 50,
    progress: (s) => ({
      current: Math.min(s.bookmarkedQuestionIds.length, 5),
      max: 5,
      completed: s.bookmarkedQuestionIds.length >= 5,
    }),
  },
];
