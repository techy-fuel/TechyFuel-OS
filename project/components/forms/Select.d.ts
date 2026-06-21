import * as React from 'react';

export interface SelectOption { value: string; label: string; }
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  hint?: string;
  options: Array<string | SelectOption>;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
