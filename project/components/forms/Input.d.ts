import * as React from 'react';

/**
 * Text field with label, leading icon, hint and error states.
 *
 * @startingPoint section="Forms" subtitle="Labeled text input with icon, hint & error" viewport="700x150"
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
