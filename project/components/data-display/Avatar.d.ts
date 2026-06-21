import * as React from 'react';

export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';
export interface AvatarProps {
  name?: string;
  src?: string;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: AvatarStatus;
  style?: React.CSSProperties;
}
export function Avatar(props: AvatarProps): JSX.Element;

export interface AvatarGroupProps {
  people: Array<string | AvatarProps>;
  /** @default 4 */
  max?: number;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export function AvatarGroup(props: AvatarGroupProps): JSX.Element;
