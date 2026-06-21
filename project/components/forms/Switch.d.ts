import * as React from 'react';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  label?: string;
  id?: string;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): JSX.Element;
