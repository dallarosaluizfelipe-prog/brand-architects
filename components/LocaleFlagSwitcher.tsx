import React from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

/**
 * Brazilian flag — refined monochrome.
 * White rounded rectangle with thin black border, black diamond and inner circle.
 */
const FlagBR = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="0.5" y="0.5" width="27" height="19" rx="3" fill="#fff" stroke="#000" strokeWidth="1" />
    <path d="M14 4 L24 10 L14 16 L4 10 Z" fill="#000" />
    <circle cx="14" cy="10" r="2.6" fill="#fff" />
  </svg>
);

/**
 * USA flag — refined monochrome.
 * White rounded rectangle with thin black border, slim horizontal stripes and a solid canton.
 */
const FlagUS = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="0.5" y="0.5" width="27" height="19" rx="3" fill="#fff" stroke="#000" strokeWidth="1" />
    {/* stripes (every other row) */}
    <g fill="#000">
      <rect x="0.5" y="3" width="27" height="1.4" />
      <rect x="0.5" y="6" width="27" height="1.4" />
      <rect x="0.5" y="9" width="27" height="1.4" />
      <rect x="0.5" y="12" width="27" height="1.4" />
      <rect x="0.5" y="15" width="27" height="1.4" />
    </g>
    {/* canton */}
    <rect x="0.5" y="0.5" width="11" height="9" fill="#000" />
    {/* tiny stars */}
    <g fill="#fff">
      {[
        [2.5, 2.2], [5, 2.2], [7.5, 2.2], [10, 2.2],
        [3.75, 4], [6.25, 4], [8.75, 4],
        [2.5, 5.8], [5, 5.8], [7.5, 5.8], [10, 5.8],
        [3.75, 7.6], [6.25, 7.6], [8.75, 7.6],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.45" />
      ))}
    </g>
  </svg>
);

interface Props {
  /** Visual size variant */
  size?: 'sm' | 'md';
  /** Optional callback fired after switching (e.g. close mobile menu) */
  onSwitch?: () => void;
  className?: string;
}

/**
 * iOS-inspired "liquid glass" pill switcher with a sliding selection capsule.
 * Two flag options (BR / US). The active flag is highlighted by a smoothly
 * animated white capsule with subtle shadow, sliding behind the icons.
 */
const LocaleFlagSwitcher: React.FC<Props> = ({ size = 'sm', onSwitch, className = '' }) => {
  const { locale, setLocale } = useLocale();

  const isMd = size === 'md';
  const flagSize = isMd ? 'w-[22px] h-[16px]' : 'w-[18px] h-[13px]';
  const buttonSize = isMd ? 'w-9 h-7' : 'w-8 h-6';
  const trackPadding = isMd ? 'p-[3px]' : 'p-[2px]';

  const handle = (target: 'pt-BR' | 'en') => {
    if (locale !== target) setLocale(target);
    onSwitch?.();
  };

  const isEn = locale === 'en';

  return (
    <div
      className={`relative inline-flex items-center rounded-full ${trackPadding} bg-white/40 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.06)] ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {/* Sliding selection capsule — the "liquid glass" pill */}
      <span
        aria-hidden="true"
        className={`absolute top-[3px] bottom-[3px] ${isMd ? 'w-9' : 'w-8'} rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15),0_4px_10px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]`}
        style={{
          transform: isEn ? `translateX(${isMd ? 36 : 32}px)` : 'translateX(0)',
        }}
      />

      <button
        type="button"
        onClick={() => handle('pt-BR')}
        aria-label="Português"
        aria-pressed={!isEn}
        className={`relative z-10 ${buttonSize} flex items-center justify-center rounded-full transition-opacity duration-200 ${
          !isEn ? 'opacity-100' : 'opacity-50 hover:opacity-80'
        }`}
      >
        <FlagBR className={`${flagSize} block`} />
      </button>
      <button
        type="button"
        onClick={() => handle('en')}
        aria-label="English"
        aria-pressed={isEn}
        className={`relative z-10 ${buttonSize} flex items-center justify-center rounded-full transition-opacity duration-200 ${
          isEn ? 'opacity-100' : 'opacity-50 hover:opacity-80'
        }`}
      >
        <FlagUS className={`${flagSize} block`} />
      </button>
    </div>
  );
};

export default LocaleFlagSwitcher;
