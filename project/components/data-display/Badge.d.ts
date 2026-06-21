import * as React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'teal';

/**
 * Status & category badge with optional leading dot.
 *
 * @startingPoint section="Data display" subtitle="Status badges across all tones" viewport="700x150"
 */
export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "neutral" */
  tone?: BadgeTone;
  /** Show a leading status dot. @default false */
  dot?: boolean;
  /** Solid fill instead of subtle tint. @default false */
  solid?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
