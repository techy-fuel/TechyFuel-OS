import * as React from 'react';

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  /** @default "brand" */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'teal';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  style?: React.CSSProperties;
}
export function ProgressBar(props: ProgressBarProps): JSX.Element;
