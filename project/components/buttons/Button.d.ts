import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Primary action control for TechyFuel OS. One primary button per view;
 * use secondary/ghost for everything else.
 *
 * @startingPoint section="Buttons" subtitle="Primary action button — 5 variants, 3 sizes" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Icon node rendered before the label (e.g. a Lucide <i>). */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Stretch to container width. @default false */
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button(props: ButtonProps): JSX.Element;
