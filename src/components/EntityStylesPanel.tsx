import React, { useState } from 'react';
import TextStyleControl from './TextStyleControl';
import { TextStylesMap, hasFieldStyle } from '../utils/textStyles';

export interface StyleField {
  key: string;
  label: string;
}

interface Props {
  title?: string;
  fields: StyleField[];
  styles: TextStylesMap | null | undefined;
  onChange: (next: TextStylesMap) => void;
}

/**
 * Collapsible panel that lists every editable text field of an entity and
 * exposes the color / font-weight / letter-spacing controls inline.
 * Stored in the entity's `text_styles` JSONB column.
 */
const EntityStylesPanel: React.FC<Props> = ({
  title = 'Estilos de texto',
  fields,
  styles,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const activeCount = fields.filter((f) => hasFieldStyle(styles, f.key)).length;

  return (
    <div className="border border-neutral-200 rounded-2xl bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] font-sans bg-black text-white px-2 py-0.5 rounded-full">
              {activeCount} customizado{activeCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span className="text-neutral-400 text-sm">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-5 py-4 space-y-2">
          <p className="text-[11px] text-neutral-400 font-sans mb-3">
            Configure cor, peso (Nunito Sans) e espaçamento entre letras para cada campo de texto deste item.
          </p>
          {fields.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-b-0"
            >
              <span className="text-xs font-sans text-neutral-700 truncate pr-3">{f.label}</span>
              <TextStyleControl
                field={f.key}
                styles={styles}
                onChange={onChange}
                label={f.label}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntityStylesPanel;