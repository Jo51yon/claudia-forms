import { DEFAULT_FIELD_REGISTRY } from './defaultFieldRegistry';
import type { ClaudiaFieldValue, ClaudiaFieldRegistry, ClaudiaFormField } from './types';

/**
 * ClaudiaFormRenderer — renders a list of fields against a values object, dispatching each
 * field to a renderer by field.type.
 *
 * This is an integration framework, not a closed form-builder: fieldRegistry is merged OVER
 * DEFAULT_FIELD_REGISTRY (not replacing it), so a project gets every built-in type working
 * first time with zero config, and can override any single type or add a brand new one without
 * touching this component's code. A field whose type has no registered renderer shows a real,
 * visible "no renderer registered" message rather than silently rendering nothing -- a missing
 * type should be obvious immediately, not discovered when someone notices a field is empty.
 */
export interface ClaudiaFormRendererProps {
  fields: ClaudiaFormField[];
  values: Record<string, ClaudiaFieldValue>;
  onChange: (fieldId: string, value: ClaudiaFieldValue) => void;
  /** Merged over DEFAULT_FIELD_REGISTRY -- override one type or add a new one. */
  fieldRegistry?: ClaudiaFieldRegistry;
}

export default function ClaudiaFormRenderer({ fields, values, onChange, fieldRegistry }: ClaudiaFormRendererProps) {
  const registry = fieldRegistry ? { ...DEFAULT_FIELD_REGISTRY, ...fieldRegistry } : DEFAULT_FIELD_REGISTRY;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {fields.map((field) => {
        const Renderer = registry[field.type];
        return (
          <div key={field.id}>
            <label className="label" htmlFor={field.id}>
              {field.label}{field.required && <span style={{ color: 'var(--claudia-kernel-alert, #b42318)' }}> *</span>}
            </label>
            {field.description && <p className="dim" style={{ fontSize: '.8rem', margin: '2px 0 6px' }}>{field.description}</p>}
            {Renderer ? (
              <Renderer field={field} value={values[field.id]} onChange={(v) => onChange(field.id, v)} />
            ) : (
              <p className="err" style={{ fontSize: '.82rem' }}>
                No renderer registered for field type "{field.type}" -- add one via the fieldRegistry prop.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
