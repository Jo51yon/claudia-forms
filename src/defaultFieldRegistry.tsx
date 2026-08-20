import { useState } from 'react';
import { ClaudiaCalendar } from '@jo51yon/claudia-calendar';
import type { ClaudiaFieldRegistry, ClaudiaFieldRendererProps } from './types';

/**
 * Real, working default renderers for the common field types -- checked against SafeSpaces'
 * own real FormRenderer.tsx (589 lines, the platform's most mature real form-rendering system)
 * for the actual field-type vocabulary in production use: text, email, url, phone, number,
 * currency, date, textarea, select/dropdown, multiselect, checkbox, toggle.
 *
 * NOT a claim of full parity with that system -- table, sheet and dynamic-choice-source types
 * are real, in-production SafeSpaces features not built here. They are not blocked either: a
 * project needing them registers its own renderer under that type key (see
 * ClaudiaFormRenderer's fieldRegistry prop), the same way any custom type would be added. This
 * is the "framework to integrate, not constrain" shape -- an unsupported type is a config
 * addition, not a wall.
 *
 * date uses @jo51yon/claudia-calendar rather than a raw <input type="date"> or a new
 * hand-rolled picker -- reusing what's already built and verified, not inventing a third way.
 */

const inputType: Record<string, string> = { email: 'email', url: 'url', phone: 'tel', text: 'text' };

function TextLike({ field, value, onChange }: ClaudiaFieldRendererProps) {
  return (
    <input className="field" type={inputType[field.type] ?? 'text'} value={(value as string) ?? ''}
           placeholder={field.description ?? undefined}
           onChange={(e) => onChange(e.target.value)} />
  );
}

function NumberLike({ field, value, onChange }: ClaudiaFieldRendererProps) {
  return (
    <input className="field" type="number" step={field.type === 'currency' ? '0.01' : '1'}
           value={value == null ? '' : String(value)}
           onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />
  );
}

function Textarea({ field, value, onChange }: ClaudiaFieldRendererProps) {
  return (
    <textarea className="field" value={(value as string) ?? ''} placeholder={field.description ?? undefined}
              onChange={(e) => onChange(e.target.value)} rows={4} />
  );
}

function DateField({ value, onChange }: ClaudiaFieldRendererProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value as string) : undefined;
  return (
    <div style={{ position: 'relative' }}>
      <input className="field" readOnly value={(value as string) ?? ''} placeholder="Select a date"
             onClick={() => setOpen((v) => !v)} style={{ cursor: 'pointer' }} />
      {open && (
        <div style={{ position: 'absolute', zIndex: 10, marginTop: 4, background: 'var(--claudia-kernel-card, #fff)',
                       border: '1px solid var(--claudia-kernel-line, #e0e0e0)', borderRadius: 'var(--claudia-kernel-radius, 8px)', padding: 10 }}>
          <ClaudiaCalendar selected={selected} onSelect={(d) => {
            onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
            setOpen(false);
          }} />
        </div>
      )}
    </div>
  );
}

function optionList(field: { options?: unknown }): string[] {
  if (Array.isArray(field.options)) return field.options as string[];
  return [];
}

function Select({ field, value, onChange }: ClaudiaFieldRendererProps) {
  return (
    <select className="field" value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select\u2026</option>
      {optionList(field).map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Multiselect({ field, value, onChange }: ClaudiaFieldRendererProps) {
  const selected = (value as string[]) ?? [];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {optionList(field).map((o) => (
        <button key={o} type="button" className={selected.includes(o) ? 'btn sm' : 'btn quiet sm'}
                onClick={() => onChange(selected.includes(o) ? selected.filter((s) => s !== o) : [...selected, o])}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Checkbox({ value, onChange }: ClaudiaFieldRendererProps) {
  return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />;
}

function Toggle({ value, onChange }: ClaudiaFieldRendererProps) {
  return (
    <button type="button" className={value ? 'btn sm' : 'btn quiet sm'} onClick={() => onChange(!value)}>
      {value ? 'Yes' : 'No'}
    </button>
  );
}

export const DEFAULT_FIELD_REGISTRY: ClaudiaFieldRegistry = {
  text: TextLike, email: TextLike, url: TextLike, phone: TextLike,
  number: NumberLike, currency: NumberLike,
  date: DateField,
  textarea: Textarea,
  select: Select, dropdown: Select,
  multiselect: Multiselect,
  checkbox: Checkbox,
  toggle: Toggle,
};
