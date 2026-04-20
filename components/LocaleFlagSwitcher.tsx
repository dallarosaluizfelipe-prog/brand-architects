import React from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

/** Brazilian flag — monochrome (black & white) */
const FlagBR = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="20" rx="2" fill="currentColor" />
    <path d="M14 3 L25 10 L14 17 L3 10 Z" fill="#fff" />
    <circle cx="14" cy="10" r="3.4" fill="currentColor" />
  </svg>
);

/** USA flag — monochrome (black & white) */
const FlagUS = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="20" rx="2" fill="#fff" />
    {/* stripes */}
    {[1, 3, 5, 7, 9].map((i) => (
      <rect key={i} y={i * 2} width="28" height="2" fill="currentColor" />
    ))}
    {/* canton */}
    <rect width="11" height="10" fill="currentColor" />
    {/* stars (simplified dots in white) */}
    {[
      [2, 2], [5, 2], [8, 2],
      [3.5, 4], [6.5, 4],
      [2, 6], [5, 6], [8, 6],
      [3.5, 8], [6.5, 8],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="0.55" fill="#fff" />
    ))}
  </svg>
);

interface Props {
  /** Visual size variant */
  size?: 'sm' | 'md';
  /** Optional callback fired after switching (e.g. close mobile menu) */
  onSwitch?: () => void;
  className?: string;
}

const LocaleFlagSwitcher: React.FC<Props> = ({ size = 'sm', onSwitch, className = '' }) => {
  const { locale, setLocale } = useLocale();

  const flagSize = size === 'md' ? 'w-5 h-[14px]' : 'w-[18px] h-[13px]';
  const gap = size === 'md' ? 'gap-2' : 'gap-1.5';

  const handle = (target: 'pt-BR' | 'en') => {
    if (locale !== target) setLocale(target);
    onSwitch?.();
  };

  return (
    <div className={`flex items-center ${gap} ${className}`} role="group" aria-label="Language selector">
      <button
        type="button"
        onClick={() => handle('pt-BR')}
        aria-label="Português"
        aria-pressed={locale === 'pt-BR'}
        className={`flex items-center justify-center rounded-[3px] overflow-hidden ring-1 transition-all ${
          locale === 'pt-BR'
            ? 'opacity-100 ring-black/40'
            : 'opacity-40 hover:opacity-80 ring-black/10'
        }`}
      >
        <FlagBR className={`${flagSize} text-black block`} />
      </button>
      <button
        type="button"
        onClick={() => handle('en')}
        aria-label="English"
        aria-pressed={locale === 'en'}
        className={`flex items-center justify-center rounded-[3px] overflow-hidden ring-1 transition-all ${
          locale === 'en'
            ? 'opacity-100 ring-black/40'
            : 'opacity-40 hover:opacity-80 ring-black/10'
        }`}
      >
        <FlagUS className={`${flagSize} text-black block`} />
      </button>
    </div>
  );
};

export default LocaleFlagSwitcher;
