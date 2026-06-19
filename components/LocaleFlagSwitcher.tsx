import React from 'react';
import { useLocale } from '@/src/contexts/LocaleContext';

/** Brazilian flag — official colors. */
const FlagBR = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="20" fill="#009C3B" />
    <path d="M14 2.5 L25.5 10 L14 17.5 L2.5 10 Z" fill="#FFDF00" />
    <circle cx="14" cy="10" r="3.6" fill="#002776" />
  </svg>
);

/** USA flag — official colors. */
const FlagUS = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="20" fill="#FFFFFF" />
    <g fill="#B22234">
      <rect y="0" width="28" height="1.54" />
      <rect y="3.08" width="28" height="1.54" />
      <rect y="6.15" width="28" height="1.54" />
      <rect y="9.23" width="28" height="1.54" />
      <rect y="12.31" width="28" height="1.54" />
      <rect y="15.38" width="28" height="1.54" />
      <rect y="18.46" width="28" height="1.54" />
    </g>
    <rect width="11.2" height="10.77" fill="#3C3B6E" />
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
 * Minimal flag switcher — flat flags, no pill/bullet background.
 * Active flag is fully opaque; inactive is faded.
 */
const LocaleFlagSwitcher: React.FC<Props> = ({ size = 'sm', onSwitch, className = '' }) => {
  const { locale, setLocale } = useLocale();

  const isMd = size === 'md';
  const flagSize = isMd ? 'w-[16px] h-[12px]' : 'w-[14px] h-[10px]';

  const handle = (target: 'pt-BR' | 'en') => {
    if (locale !== target) setLocale(target);
    onSwitch?.();
  };

  const isEn = locale === 'en';

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => handle('pt-BR')}
        aria-label="Português"
        aria-pressed={!isEn}
        className={`flex items-center justify-center transition-opacity duration-200 ${
          !isEn ? 'opacity-100' : 'opacity-40 hover:opacity-80'
        }`}
      >
        <FlagBR className={`${flagSize} block rounded-[2px]`} />
      </button>
      <button
        type="button"
        onClick={() => handle('en')}
        aria-label="English"
        aria-pressed={isEn}
        className={`flex items-center justify-center transition-opacity duration-200 ${
          isEn ? 'opacity-100' : 'opacity-40 hover:opacity-80'
        }`}
      >
        <FlagUS className={`${flagSize} block rounded-[2px]`} />
      </button>
    </div>
  );
};

export default LocaleFlagSwitcher;
