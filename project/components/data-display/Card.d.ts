import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Internal padding. @default "md" */
  padding?: 'none' | 'sm' | 'md' | 'lg' | string;
  /** Lift + border change on hover. @default false */
  interactive?: boolean;
}
export function Card(props: CardProps): JSX.Element;
