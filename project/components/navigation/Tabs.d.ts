import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

/**
 * Underline tab bar for switching views within a page.
 *
 * @startingPoint section="Navigation" subtitle="Underline tab bar with counts" viewport="700x120"
 */
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export function Tabs(props: TabsProps): JSX.Element;
