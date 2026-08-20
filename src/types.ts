import type { ReactNode } from 'react';

/**
 * A field definition, deliberately minimal and provider-agnostic -- projects supply their own
 * real field data (options, required, help text) and this shape carries only what a renderer
 * actually needs to draw the right control and read/write the right value.
 */
export interface ClaudiaFormField {
  id: string;
  type: string;
  label: string;
  description?: string | null;
  required?: boolean;
  /** For select/multiselect: the real choices. Free-form so a project can carry its own shape. */
  options?: unknown;
}

export type ClaudiaFieldValue = string | number | boolean | string[] | null | undefined;

export interface ClaudiaFieldRendererProps {
  field: ClaudiaFormField;
  value: ClaudiaFieldValue;
  onChange: (value: ClaudiaFieldValue) => void;
}

export type ClaudiaFieldRenderer = (props: ClaudiaFieldRendererProps) => ReactNode;

/** The registry a form renderer dispatches on -- keyed by field.type. */
export type ClaudiaFieldRegistry = Record<string, ClaudiaFieldRenderer>;
