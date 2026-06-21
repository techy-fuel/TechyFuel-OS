import * as React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Single icon node. */
  children?: React.ReactNode;
  /** @default "ghost" */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (sets aria-label). */
  label?: string;
  disabled?: boolean;
}

export function IconButton(props: IconButtonProps): JSX.Element;
