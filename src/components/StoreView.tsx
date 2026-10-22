import React, { useState } from 'react';
import { UserStats, ThemeId } from '../types';
import { AVATARS, THEMES, STORE_LIFELINES, StoreItem } from '../data/storeData';
import { toBn } from '../utils/bengali';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import { ASSETS } from '../assets';
import { recordPurchaseInStats } from '../utils/storage';
import {
  ChevronLeft,
  Store,
  Sparkles,
  Percent,
  Lightbulb,
  Clock,
  FastForward,
  Check,
  Lock,
  Palette,
  ShieldCheck,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

interface StoreViewProps {
  stats: UserStats;
  updateStats: (updater: (prev: UserStats) => UserStats) => void;
  onBack: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  stats,
  updateStats,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'lifelines' | 'avatars' | 'themes' | 'history'>('lifelines');
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBuyLifeline = (item: StoreItem) => {
    if (stats.coins < item.price) {
      sounds.playWrong();
      showToast('পর্যাপ্ত কয়েন নেই! কুইজ খেলে কয়েন বাড়ান।');
      return;
    }

    sounds.playCoin();
    sounds.playLifeline();
    fireConfetti();

    updateStats((prev) => {
      const updated = {
        ...prev,
        coins: prev.coins - item.price,
        lifelines: {
          ...prev.lifelines,
          [item.type]: prev.lifelines[item.type] + item.amount,
        },
      };
      return recordPurchaseInStats(updated, {
        id: item.id,
        name: item.name,
        price: item.price,
        type: 'lifeline',
      });
    });

    showToast(`সফলভাবে ${item.name} কেনা হয়েছে এবং লোকাল স্টোরেজে সেভ হয়েছে!`);
  };

  const handleUnlockAvatar = (avatarId: string, avatarName: string, price: number) => {
    if (stats.coins < price) {
      sounds.playWrong();
      showToast('পর্যাপ্ত কয়েন নেই!');
      return;
    }

    sounds.playCoin();
    fireConfetti();

    updateStats((prev) => {
      const updated = {
        ...prev,
        coins: prev.coins - price,
        unlockedAvatars: [...prev.unlockedAvatars, avatarId],
        selectedAvatar: avatarId,
      };
      return recordPurchaseInStats(updated, {
        id: avatarId,
        name: avatarName,
        price: price,
        type: 'avatar',
      });
    });

    showToast(`'${avatarName}' অবতার আনলক হয়েছে এবং লোকাল স্টোরেজে সেভ রয়েছে!`);
  };

  const handleSelectAvatar = (avatarId: string) => {
    sounds.playClick();
    updateStats((prev) => ({
      ...prev,
      selectedAvatar: avatarId,
    }));
    showToast('অবতার সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const handleUnlockTheme = (themeId: ThemeId, themeName: string, price: number) => {
    if (stats.coins < price) {
      sounds.playWrong();
      showToast('পর্যাপ্ত কয়েন নেই!');
      return;
    }

    sounds.playCoin();
    fireConfetti();

    updateStats((prev) => {
      const updated = {
        ...prev,
        coins: prev.coins - price,
        unlockedThemes: [...prev.unlockedThemes, themeId],
        selectedTheme: themeId,
      };
      return recordPurchaseInStats(updated, {
        id: themeId,
        name: themeName,
        price: price,
        type: 'theme',
      });
    });

    showToast(`'${themeName}' থিম আনলক ও লোকাল স্টোরেজে সেভ হয়েছে!`);
  };

  const handleSelectTheme = (themeId: ThemeId) => {
    sounds.playClick();
    updateStats((prev) => ({
      ...prev,
      selectedTheme: themeId,
    }));
    showToast('থিম পরিবর্তন করা হয়েছে!');
  };

  const getLifelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Percent':
        return <Percent className="w-6 h-6 text-amber-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 text-yellow-400" />;
      case 'Clock':
        return <Clock className="w-6 h-6 text-cyan-400" />;
      case 'FastForward':
        return <FastForward className="w-6 h-6 text-rose-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl font-bold shadow-2xl border border-amber-300 animate-slide-up flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-slate-950" />
          <span>{notification}</span>
        </div>
      )}

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
              <Store className="w-6 h-6 text-amber-400" />
              <span>মেলা দোকান ও বাজার</span>
            </h1>
            <p className="text-xs text-amber-300/80">
              কয়েন দিয়ে কিনুন লাইফলাইন, খুলে নিন অভিনব অবতার ও রঙিন থিম (সবকিছু লোকাল স্টোরেজে সেভ থাকে)!
            </p>
          </div>
        </div>

        {/* Current Coins Wallet */}
        <div className="flex items-center gap-2.5 bg-amber-500/20 border border-amber-400/40 px-4 py-2 rounded-xl text-amber-200 font-bold text-sm shadow-xs">
          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-amber-400">
            <img
              src={ASSETS.melaCoin}
              alt="কয়েন"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-base text-yellow-300 font-black tabular-nums">
            {toBn(stats.coins)} কয়েন
          </span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-amber-950/60 border border-amber-500/30 rounded-2xl overflow-x-auto">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('lifelines');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'lifelines'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
        >
          লাইফলাইন প্যাক
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('avatars');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'avatars'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
        >
          অবতার ও চরিত্র
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('themes');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'themes'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
        >
          মেলার থিম
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('history');
          }}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-amber-200/80 hover:text-amber-100 hover:bg-amber-900/40'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>ক্রয় বিবরণী ও ভাণ্ডার</span>
        </button>
      </div>

      {/* TAB 1: LIFELINES */}
      {activeTab === 'lifelines' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STORE_LIFELINES.map((item) => {
            const currentHeld = stats.lifelines[item.type];
            const canAfford = stats.coins >= item.price;

            return (
              <div
                key={item.id}
                className="bg-amber-950/70 border border-amber-500/25 rounded-2xl p-5 text-amber-50 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-900/70 border border-amber-500/30 flex items-center justify-center">
                      {getLifelineIcon(item.iconName)}
                    </div>
                    <span className="text-xs text-amber-300/80 bg-amber-500/15 px-2.5 py-1 rounded-md border border-amber-500/20">
                      ভাণ্ডারে আছে: <strong className="text-amber-200 tabular-nums">{toBn(currentHeld)}</strong>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-amber-100">{item.name}</h2>
                  <p className="text-xs text-amber-100/70 mt-1">{item.description}</p>
                  <p className="text-[11px] text-amber-400/90 mt-1 font-medium">{item.benefit}</p>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                    <span className="tabular-nums">{toBn(item.price)}</span>
                    <span className="text-xs text-amber-400/80">কয়েন</span>
                  </div>

                  <button
                    onClick={() => handleBuyLifeline(item)}
                    disabled={!canAfford}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-sm'
                        : 'bg-amber-950/40 border border-amber-700/20 text-amber-500/30 cursor-not-allowed'
                    }`}
                  >
                    কিনুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: AVATARS */}
      {activeTab === 'avatars' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVATARS.map((avatar) => {
            const isUnlocked = stats.unlockedAvatars.includes(avatar.id);
            const isSelected = stats.selectedAvatar === avatar.id;
            const canAfford = stats.coins >= avatar.price;

            return (
              <div
                key={avatar.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-amber-900/60 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-amber-950/70 border-amber-500/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-md">
                      {avatar.emoji}
                    </div>
                    {isSelected && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        নির্বাচিত
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-amber-100">{avatar.name}</h2>
                  <span className="text-xs text-amber-400 block font-medium">{avatar.title}</span>
                  <p className="text-xs text-amber-100/70 mt-1 leading-relaxed">
                    {avatar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                  {!isUnlocked ? (
                    <>
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{toBn(avatar.price)}</span>
                        <span className="text-xs">কয়েন</span>
                      </div>

                      <button
                        onClick={() => handleUnlockAvatar(avatar.id, avatar.name, avatar.price)}
                        disabled={!canAfford}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-sm'
                            : 'bg-amber-950/40 border border-amber-700/20 text-amber-500/30 cursor-not-allowed'
                        }`}
                      >
                        আনলক করুন
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSelectAvatar(avatar.id)}
                      disabled={isSelected}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
                        isSelected
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-amber-800/60 hover:bg-amber-700 text-amber-200 border border-amber-500/30'
                      }`}
                    >
                      {isSelected ? 'সক্রিয় আছে' : 'ব্যবহার করুন'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: THEMES */}
      {activeTab === 'themes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const isUnlocked = stats.unlockedThemes.includes(theme.id);
            const isSelected = stats.selectedTheme === theme.id;
            const canAfford = stats.coins >= theme.price;

            return (
              <div
                key={theme.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-amber-900/60 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-amber-950/70 border-amber-500/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.bgGradient} border border-white/20 shadow-md flex items-center justify-center text-white`}
                    >
                      <Palette className="w-6 h-6" />
                    </div>

                    {isSelected && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        বর্তমান থিম
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-amber-100">{theme.name}</h2>
                  <p className="text-xs text-amber-100/70 mt-1">{theme.description}</p>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between">
                  {!isUnlocked ? (
                    <>
                      <div className="flex items-center gap-1 text-amber-300 font-bold text-sm">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="tabular-nums">{toBn(theme.price)}</span>
                        <span className="text-xs">কয়েন</span>
                      </div>

                      <button
                        onClick={() => handleUnlockTheme(theme.id, theme.name, theme.price)}
                        disabled={!canAfford}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                          canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow-sm'
                            : 'bg-amber-950/40 border border-amber-700/20 text-amber-500/30 cursor-not-allowed'
                        }`}
                      >
                        আনলক করুন
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleSelectTheme(theme.id)}
                      disabled={isSelected}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
                        isSelected
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-amber-800/60 hover:bg-amber-700 text-amber-200 border border-amber-500/30'
                      }`}
                    >
                      {isSelected ? 'সক্রিয় আছে' : 'থিম প্রয়োগ করুন'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: PURCHASE HISTORY & INVENTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Storage Assurance Banner */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-100">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="text-emerald-300 block">লোকাল স্টোরেজ স্থায়ী সংরক্ষণ নিশ্চিত:</strong>
              আপনার কেনা সকল লাইফলাইন, আনলক করা চরিত্র এবং থিম ব্রাউজারের লোকাল স্টোরেজে সম্পূর্ণ সেভ রয়েছে।
            </div>
          </div>

          {/* Current Inventory Summary */}
          <div className="bg-amber-950/70 border border-amber-500/25 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-amber-100">আপনার বর্তমান ভাণ্ডার</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-500/20">
                <span className="text-[11px] text-amber-300 block">৫০-৫০ লাইফলাইন</span>
                <span className="text-xl font-bold text-white tabular-nums">{toBn(stats.lifelines.fiftyFifty)} টি</span>
              </div>
              <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-500/20">
                <span className="text-[11px] text-amber-300 block">ইঙ্গিত (Hints)</span>
                <span className="text-xl font-bold text-white tabular-nums">{toBn(stats.lifelines.hint)} টি</span>
              </div>
              <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-500/20">
                <span className="text-[11px] text-amber-300 block">সময় ফ্রিজ</span>
                <span className="text-xl font-bold text-white tabular-nums">{toBn(stats.lifelines.timeFreeze)} টি</span>
              </div>
              <div className="bg-amber-900/50 p-3 rounded-xl border border-amber-500/20">
                <span className="text-[11px] text-amber-300 block">স্কিপ / বদল</span>
                <span className="text-xl font-bold text-white tabular-nums">{toBn(stats.lifelines.skip)} টি</span>
              </div>
            </div>
          </div>

          {/* Purchase History Log */}
          <div className="bg-amber-950/70 border border-amber-500/25 rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-bold text-amber-100">ক্রয় বিবরণ ও রসিদসমূহ</h2>
            {stats.purchaseHistory.length === 0 ? (
              <p className="text-xs text-amber-300/60 py-4 text-center">
                এখনো কোনো কেনাকাটা করা হয়নি। দোকান থেকে লাইফলাইন বা অবতার কিনলে তা এখানে স্থায়ীভাবে তালিকাভুক্ত থাকবে।
              </p>
            ) : (
              <div className="divide-y divide-amber-500/15">
                {stats.purchaseHistory.map((rec) => (
                  <div key={rec.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-100 block">{rec.itemName}</span>
                      <span className="text-[10px] text-amber-300/60">
                        {new Date(rec.purchasedAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="font-bold text-yellow-400 tabular-nums">
                      -{toBn(rec.price)} কয়েন
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
