export type GameMode =
  | 'HOME'
  | 'LEVELS'
  | 'PLAY_LEVEL'
  | 'CATEGORY_SELECT'
  | 'PLAY_CATEGORY'
  | 'TIME_RUSH'
  | 'DAILY_CHALLENGE'
  | 'SPIN_WHEEL'
  | 'TWO_PLAYER'
  | 'STORE'
  | 'RIDDLE_BOOK'
  | 'ACHIEVEMENTS';

export type ThemeId = 'classic_mela' | 'green_bangla' | 'night_carnival' | 'royal_durbar';

export interface AvatarItem {
  id: string;
  name: string;
  title: string;
  price: number;
  unlocked: boolean;
  emoji: string;
  description: string;
}

export interface ThemeItem {
  id: ThemeId;
  name: string;
  price: number;
  unlocked: boolean;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  description: string;
}

export interface QuestionAnswerRecord {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
  answeredAt: string;
}

export interface PurchaseRecord {
  id: string;
  itemName: string;
  itemType: 'lifeline' | 'avatar' | 'theme';
  price: number;
  purchasedAt: string;
}

export interface UserStats {
  coins: number;
  unlockedLevel: number;
  levelStars: Record<number, number>; // levelNumber -> stars (1, 2, 3)
  lifelines: {
    fiftyFifty: number;
    hint: number;
    timeFreeze: number;
    skip: number;
    doubleCoins: number;
  };
  selectedAvatar: string;
  selectedTheme: ThemeId;
  unlockedAvatars: string[];
  unlockedThemes: ThemeId[];
  bookmarkedQuestionIds: number[];
  solvedQuestionIds: number[]; // All question IDs correctly solved so user doesn't have to re-answer
  answeredQuestions: Record<number, QuestionAnswerRecord>; // Full history of user's answers
  purchaseHistory: PurchaseRecord[]; // History of items bought in store
  lastDailyClaimDate: string; // YYYY-MM-DD
  dailyStreak: number;
  totalCorrect: number;
  totalWrong: number;
  bestTimeRushScore: number;
  achievementsClaimed: string[];
  lastSpinDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardCoins: number;
  progress: (stats: UserStats) => { current: number; max: number; completed: boolean };
}

