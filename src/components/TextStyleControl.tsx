import React, { useEffect, useRef, useState } from 'react';
import {
  NUNITO_WEIGHTS,
  TextStyle,
  TextStylesMap,
  hasFieldStyle,
  setFieldStyle,
} from '../utils/textStyles';

interface Props {
  field: string;
  styles: TextStylesMap | null | undefined;
  onChange: (next: TextStylesMap) => void;
  /** Compact label shown next to swatch (optional) */
  label?: string;
}

/**
 * Small "Aa" popover button that lets the admin edit color, font-weight
 * (always Nunito Sans) and letter-spacing for a specific text field.
 * Persists into a JSONB `text_styles` map keyed by `field`.
 */
const TextStyleControl: React.FC<Props> = ({ field, styles, onChange, label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current: TextStyle = styles?.[field] ?? {};
  const active = hasFieldStyle(styles, field);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const apply = (patch: Partial<TextStyle>) => {
    onChange(setFieldStyle(styles, field, patch));
  };

  const reset = () => {
    const next = { ...(styles ?? {}) };
    delete next[field];
    onChange(next);
  };

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
        title={`Estilo de texto${label ? ` — ${label}` : ''}`}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-sans border transition-colors ${
          active
            ? 'border-black bg-black text-white'
            : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-black'
        }`}
      >
        <span
          className="inline-block w-3 h-3 rounded-sm border border-white/40"
          style={{ background: current.color || 'transparent' }}
        />
        Aa
      </button>

      {open && (
        <div
          className="absolute z-50 top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-sans">
              Estilo do texto
            </span>
            {active && (
              <button
                type="button"
                onClick={reset}
                className="text-[10px] font-sans text-neutral-400 hover:text-red-500"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Cor */}
          <div>
            <label className="block text-[10px] font-sans text-neutral-500 mb-1">Cor</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.color || '#000000'}
                onChange={(e) => apply({ color: e.target.value })}
                className="w-9 h-9 rounded border border-neutral-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={current.color || ''}
                onChange={(e) => apply({ color: e.target.value || undefined })}
                placeholder="#000000"
                className="flex-1 border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-sans"
              />
            </div>
          </div>

          {/* Peso */}
          <div>
            <label className="block text-[10px] font-sans text-neutral-500 mb-1">
              Peso (Nunito Sans)
            </label>
            <select
              value={current.weight ?? ''}
              onChange={(e) =>
                apply({ weight: e.target.value ? Number(e.target.value) : undefined })
              }
              className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-sans bg-white"
            >
              <option value="">Padrão</option>
              {NUNITO_WEIGHTS.map((w) => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>
          </div>

          {/* Letter spacing */}
          <div>
            <label className="block text-[10px] font-sans text-neutral-500 mb-1">
              Espaçamento entre letras (em)
            </label>
            <input
              type="number"
              step={0.01}
              value={current.letterSpacing ?? ''}
              onChange={(e) =>
                apply({
                  letterSpacing: e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
              placeholder="ex: -0.06"
              className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-sans"
            />
          </div>

          {/* Font size */}
          <div>
            <label className="block text-[10px] font-sans text-neutral-500 mb-1">
              Tamanho da fonte (rem)
            </label>
            <input
              type="number"
              step={0.05}
              min={0}
              value={current.fontSize ?? ''}
              onChange={(e) =>
                apply({
                  fontSize: e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
              placeholder="ex: 1.25"
              className="w-full border border-neutral-200 rounded-lg px-2 py-1.5 text-xs font-sans"
            />
            <p className="text-[10px] text-neutral-400 font-sans mt-1">1rem ≈ 16px. Deixe vazio para usar o padrão.</p>
          </div>

          <p className="text-[10px] text-neutral-400 font-sans leading-snug">
            Sobrescreve o estilo global apenas deste campo. Salve a edição para aplicar.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextStyleControl;