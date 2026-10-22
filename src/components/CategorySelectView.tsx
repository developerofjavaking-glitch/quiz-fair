import React from 'react';
import { ALL_QUESTIONS } from '../data/questions';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import {
  ChevronLeft,
  Sparkles,
  TreePine,
  Brain,
  Globe2,
  Atom,
  PawPrint,
  BookOpen,
  Quote,
  Calculator,
  UtensilsCrossed,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

interface CategorySelectViewProps {
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; desc: string }> = {
  'গ্রামীণ ধাঁধা': {
    icon: TreePine,
    color: 'from-amber-600 to-yellow-600',
    desc: 'গ্রাম বাংলার ঐতিহ্যবাহী মুখে মুখে প্রচলিত ছড়ার ধাঁধা',
  },
  'বুদ্ধির খেলা': {
    icon: Brain,
    color: 'from-purple-600 to-indigo-600',
    desc: 'যুক্তি, সূক্ষ্ম বুদ্ধি ও লজিক্যাল চিন্তার মজার ধাঁধা',
  },
  'সাধারণ জ্ঞান': {
    icon: Globe2,
    color: 'from-blue-600 to-cyan-600',
    desc: 'বাংলাদেশ, মুক্তিযুদ্ধ, ভূগোল, নদী ও বিশ্বের গুরুত্বপূর্ণ তথ্য',
  },
  'মজার বিজ্ঞান': {
    icon: Atom,
    color: 'from-emerald-600 to-teal-600',
    desc: 'মহাকাশ, মানবদেহ, পদার্থ ও প্রাত্যহিক বিজ্ঞানের রোমাঞ্চকর তথ্য',
  },
  'পশুপাখি ও প্রকৃতি': {
    icon: PawPrint,
    color: 'from-green-600 to-lime-600',
    desc: 'জীবজন্তু, পরিযায়ী পাখি, সামুদ্রিক প্রাণী ও উদ্ভিদ জগত',
  },
  'বাংলা সাহিত্য': {
    icon: BookOpen,
    color: 'from-rose-600 to-pink-600',
    desc: 'রবীন্দ্রনাথ, নজরুল, সুকুমার রায়, উপন্যাস ও কাব্যের রসাস্বাদন',
  },
  'প্রবাদ ও সংস্কৃতি': {
    icon: Quote,
    color: 'from-orange-600 to-amber-700',
    desc: 'চিরন্তন প্রবাদ-প্রবচন, বাগধারা ও লোকসংস্কৃতির অমূল্য জ্ঞান',
  },
  'গণিতের ধাঁধা': {
    icon: Calculator,
    color: 'from-violet-600 to-indigo-700',
    desc: 'সংখ্যা ধারা, জ্যামিতি, ঘড়ি ও চটজলদি মানসিক গণিতের হিসাব',
  },
  'খাবার ও সংস্কৃতি': {
    icon: UtensilsCrossed,
    color: 'from-red-600 to-amber-600',
    desc: 'পিঠাপুলি, মিষ্টি, ঐতিহ্যবাহী উৎসবের খাবার ও সংস্কৃতি',
  },
  'ঐতিহ্য ও মূল্যবোধ': {
    icon: HeartHandshake,
    color: 'from-teal-600 to-cyan-700',
    desc: 'ঐতিহাসিক ঘটনা, নৈতিক শিক্ষা ও ঐতিহ্যবাহী জীবনবোধ',
  },
};

export const CategorySelectView: React.FC<CategorySelectViewProps> = ({
  onSelectCategory,
  onBack,
}) => {
  // Compute counts
  const categoryCounts = ALL_QUESTIONS.reduce((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(CATEGORY_META);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="bg-amber-950/80 border border-amber-500/30 rounded-2xl p-5 text-amber-50 shadow-sm flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-amber-100">বিষয়ভিত্তিক মেলা</h1>
            <p className="text-xs text-amber-300/80">
              আপনার পছন্দের বিষয়ে ১০টি করে প্রশ্নের বিশেষ কুইজ রাউন্ড খেলুন
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
          মোট ১০টি বিষয়
        </span>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat] || {
            icon: Sparkles,
            color: 'from-amber-600 to-orange-600',
            desc: 'মজার কুইজ ও বুদ্ধির পরীক্ষা',
          };
          const Icon = meta.icon;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                onSelectCategory(cat);
              }}
              className="group bg-amber-950/70 hover:bg-amber-900/90 border border-amber-500/25 hover:border-amber-400/50 rounded-2xl p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between text-amber-50"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-400/30 tabular-nums">
                    {toBn(count)}+ প্রশ্ন
                  </span>
                </div>

                <h2 className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                  {cat}
                </h2>
                <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                  {meta.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-300">
                <span>এই বিষয়ে খেলুন</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
