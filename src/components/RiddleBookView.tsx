import React, { useState, useMemo } from 'react';
import { ALL_QUESTIONS, CATEGORIES, Question } from '../data/questions';
import { UserStats } from '../types';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import {
  ChevronLeft,
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface RiddleBookViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

export const RiddleBookView: React.FC<RiddleBookViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল ধাঁধা');
  const [solvedFilter, setSolvedFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  const totalSolvedCount = stats.solvedQuestionIds.length;
  const totalQuestionsCount = ALL_QUESTIONS.length;
  const solvedPercent = Math.round((totalSolvedCount / totalQuestionsCount) * 100);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => {
      // Category match
      if (selectedCategory !== 'সকল ধাঁধা' && q.category !== selectedCategory) {
        return false;
      }
      // Solved filter
      if (solvedFilter === 'solved' && !stats.solvedQuestionIds.includes(q.id)) {
        return false;
      }
      if (solvedFilter === 'unsolved' && stats.solvedQuestionIds.includes(q.id)) {
        return false;
      }
      if (solvedFilter === 'bookmarked' && !stats.bookmarkedQuestionIds.includes(q.id)) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesAns = q.options[q.answerIndex].toLowerCase().includes(query);
        const matchesHint = q.hint?.toLowerCase().includes(query);
        if (!matchesQ && !matchesAns && !matchesHint) return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, solvedFilter, stats.solvedQuestionIds, stats.bookmarkedQuestionIds]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const currentItems = filteredQuestions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleReveal = (id: number) => {
    sounds.playClick();
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: number) => {
    sounds.playClick();
    updateStats((s) => {
      const exists = s.bookmarkedQuestionIds.includes(id);
      const updated = exists
        ? s.bookmarkedQuestionIds.filter((item) => item !== id)
        : [...s.bookmarkedQuestionIds, id];
      return { ...s, bookmarkedQuestionIds: updated };
    });
  };

  const handleCopy = (q: Question) => {
    sounds.playClick();
    const text = `🎯 ধাঁধা: ${q.question}\n💡 সঠিক উত্তর: ${q.options[q.answerIndex]}\n(উৎস: ধাঁধার মেলা)`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-amber-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>ধাঁধার খাতা ও সংগ্রহশালা</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              ১,০৫০টি ধাঁধার সম্পূর্ণ সংগ্রহ—আপনার সকল উত্তর লোকাল স্টোরেজে সংরক্ষিত থাকে।
            </p>
          </div>
        </div>

        {/* Solved Counter Widget */}
        <div className="bg-amber-900/60 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-200 flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>সমাধান সম্পন্ন:</span>
            <strong className="text-emerald-300 tabular-nums">
              {toBn(totalSolvedCount)} / {toBn(totalQuestionsCount)}
            </strong>
          </div>
          <div className="w-28 h-1.5 rounded-full bg-amber-950/80 overflow-hidden mt-1">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${solvedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs (All / Solved / Unsolved / Bookmarked) */}
      <div className="flex items-center gap-2 p-1 bg-amber-950/60 border border-amber-500/25 rounded-2xl overflow-x-auto">
        <button
          onClick={() => {
            sounds.playClick();
            setSolvedFilter('all');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            solvedFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-amber-200/80 hover:bg-amber-900/40'
          }`}
        >
          সকল প্রশ্ন ({toBn(totalQuestionsCount)})
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSolvedFilter('solved');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
            solvedFilter === 'solved'
              ? 'bg-emerald-500 text-slate-950 shadow-xs font-black'
              : 'text-emerald-300/90 hover:bg-amber-900/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>সমাধানকৃত ({toBn(totalSolvedCount)})</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSolvedFilter('unsolved');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
            solvedFilter === 'unsolved'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-amber-200/80 hover:bg-amber-900/40'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>সমাধান বাকি ({toBn(totalQuestionsCount - totalSolvedCount)})</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setSolvedFilter('bookmarked');
            setCurrentPage(1);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
            solvedFilter === 'bookmarked'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-amber-200/80 hover:bg-amber-900/40'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>প্রিয় তালিকা ({toBn(stats.bookmarkedQuestionIds.length)})</span>
        </button>
      </div>

      {/* Search & Category Controls */}
      <div className="bg-amber-950/70 border border-amber-500/25 rounded-2xl p-4 space-y-3">
        {/* Search Box */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/70" />
          <input
            type="text"
            placeholder="যেকোনো ধাঁধা বা শব্দ খুঁজুন (যেমন: পাখি, নদী, গাছ, লজিক)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-amber-900/40 border border-amber-500/30 rounded-xl text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : 'bg-amber-900/30 text-amber-200/80 border-amber-500/20 hover:text-amber-100 hover:bg-amber-900/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Riddle Cards List */}
      <div className="space-y-3.5">
        {currentItems.length === 0 ? (
          <div className="bg-amber-950/60 border border-amber-500/20 rounded-2xl p-12 text-center text-amber-200/80 space-y-2">
            <p className="text-base font-bold text-amber-300">কোনো ধাঁধা পাওয়া যায়নি!</p>
            <p className="text-xs">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
          </div>
        ) : (
          currentItems.map((q) => {
            const isSolved = stats.solvedQuestionIds.includes(q.id);
            const isBookmarked = stats.bookmarkedQuestionIds.includes(q.id);
            const isRevealed = revealedIds.includes(q.id);
            const isCopied = copiedId === q.id;

            return (
              <div
                key={q.id}
                className={`border rounded-2xl p-4 sm:p-5 text-amber-50 transition-all space-y-3 ${
                  isSolved
                    ? 'bg-emerald-950/40 border-emerald-500/40 shadow-xs'
                    : 'bg-amber-950/70 border-amber-500/25 hover:border-amber-400/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-amber-300/80">নং {toBn(q.id)}</span>
                    <span aria-hidden="true" className="text-amber-500/40">·</span>
                    <span className="text-amber-200/90">{q.category}</span>
                    <span aria-hidden="true" className="text-amber-500/40">·</span>
                    {isSolved ? (
                      <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        সমাধানকৃত ✓
                      </span>
                    ) : (
                      <span className="text-[11px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                        সমাধান বাকি
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(q)}
                      title="ধাঁধাটি কপি করুন"
                      className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-900 text-amber-300 border border-amber-500/20 transition-colors"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      title={isBookmarked ? 'পছন্দ থেকে সরান' : 'পছন্দে রাখুন'}
                      className="p-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-900 text-amber-300 border border-amber-500/20 transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-base sm:text-lg font-bold text-amber-100 leading-snug">
                  {q.question}
                </h2>

                {/* Reveal Answer Area */}
                <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span>উত্তর লুকান</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>উত্তর দেখুন</span>
                      </>
                    )}
                  </button>

                  {isRevealed && (
                    <div className="text-xs bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-lg text-emerald-300 font-semibold animate-fade-in">
                      সঠিক উত্তর: <strong className="text-emerald-200">{q.options[q.answerIndex]}</strong>
                      {q.explanation && <span className="opacity-80 ml-1.5">({q.explanation})</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentPage((p) => Math.max(p - 1, 1));
            }}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-900/50 hover:bg-amber-900 border border-amber-500/30 text-amber-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            পূর্ববর্তী
          </button>

          <span className="text-xs text-amber-300 font-bold px-3 py-1 tabular-nums">
            পৃষ্ঠা {toBn(currentPage)} / {toBn(totalPages)}
          </span>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentPage((p) => Math.min(p + 1, totalPages));
            }}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-900/50 hover:bg-amber-900 border border-amber-500/30 text-amber-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
};
