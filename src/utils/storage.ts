import { UserStats, QuestionAnswerRecord, PurchaseRecord } from '../types';
import { INITIAL_USER_STATS } from '../data/storeData';

export const STORAGE_KEY = 'dhadhar_mela_user_stats_v3';
export const LEGACY_KEY = 'dhadhar_mela_user_stats_v2';

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_USER_STATS,
        ...parsed,
        lifelines: {
          ...INITIAL_USER_STATS.lifelines,
          ...(parsed.lifelines || {}),
        },
        unlockedAvatars: Array.isArray(parsed.unlockedAvatars)
          ? parsed.unlockedAvatars
          : INITIAL_USER_STATS.unlockedAvatars,
        unlockedThemes: Array.isArray(parsed.unlockedThemes)
          ? parsed.unlockedThemes
          : INITIAL_USER_STATS.unlockedThemes,
        bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds)
          ? parsed.bookmarkedQuestionIds
          : [],
        solvedQuestionIds: Array.isArray(parsed.solvedQuestionIds)
          ? parsed.solvedQuestionIds
          : [],
        answeredQuestions: parsed.answeredQuestions || {},
        purchaseHistory: Array.isArray(parsed.purchaseHistory)
          ? parsed.purchaseHistory
          : [],
      };
    }
  } catch (e) {
    console.error('Failed to load stats from localStorage:', e);
  }
  return INITIAL_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage:', e);
  }
}

export function recordAnswerInStats(
  prevStats: UserStats,
  questionId: number,
  selectedOption: number,
  isCorrect: boolean
): UserStats {
  const timestamp = new Date().toISOString();
  const answerRecord: QuestionAnswerRecord = {
    questionId,
    selectedOption,
    isCorrect,
    answeredAt: timestamp,
  };

  const newAnsweredQuestions = {
    ...prevStats.answeredQuestions,
    [questionId]: answerRecord,
  };

  const alreadySolved = prevStats.solvedQuestionIds.includes(questionId);
  const newSolved = isCorrect && !alreadySolved
    ? [...prevStats.solvedQuestionIds, questionId]
    : prevStats.solvedQuestionIds;

  return {
    ...prevStats,
    answeredQuestions: newAnsweredQuestions,
    solvedQuestionIds: newSolved,
  };
}

export function recordPurchaseInStats(
  prevStats: UserStats,
  item: { id: string; name: string; price: number; type: 'lifeline' | 'avatar' | 'theme' }
): UserStats {
  const newPurchase: PurchaseRecord = {
    id: `${item.id}_${Date.now()}`,
    itemName: item.name,
    itemType: item.type,
    price: item.price,
    purchasedAt: new Date().toISOString(),
  };

  return {
    ...prevStats,
    purchaseHistory: [newPurchase, ...prevStats.purchaseHistory],
  };
}
