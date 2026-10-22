// Bengali numeric and string helpers

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBn(num: number | string): string {
  if (num === null || num === undefined) return '';
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${toBn(mins.toString().padStart(2, '0'))}:${toBn(secs.toString().padStart(2, '0'))}`;
}

export const PRAISE_PHRASES = [
  'চমৎকার হয়েছে!',
  'একদম সঠিক!',
  'অসাধারণ বুদ্ধি!',
  'দারুণ জবাব!',
  'খাঁটি মেধা!',
  'শাবাশ!',
  'ধাঁধার ওস্তাদ!',
  'বুদ্ধির মেলা জয়ী!',
];

export const ENCOURAGE_PHRASES = [
  'একটু চেষ্টা করলেই পারবেন!',
  'কোনো ব্যাপার না, পরেরটা একদম সঠিক হবে!',
  'বুদ্ধি তো কম নয়, আরেকটু ভাবুন!',
  'ভুল থেকেই মানুষ শেখে!',
];

export function getRandomPraise(): string {
  return PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
}

export function getRandomEncourage(): string {
  return ENCOURAGE_PHRASES[Math.floor(Math.random() * ENCOURAGE_PHRASES.length)];
}
