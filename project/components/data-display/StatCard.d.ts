import * as React from 'react';

/**
 * KPI metric tile for dashboards.
 *
 * @startingPoint section="Data display" subtitle="Dashboard KPI tile with delta" viewport="320x150"
 */
export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  /** Delta string e.g. "12.5%" or "-3.1%". */
  delta?: string;
  /** Force arrow direction; inferred from delta sign otherwise. */
  deltaDirection?: 'up' | 'down';
  icon?: React.ReactNode;
  /** Icon chip tone. @default "brand" */
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'violet' | 'teal';
  /** Optional sparkline/chart node rendered below. */
  sparkline?: React.ReactNode;
  style?: React.CSSProperties;
}
export function StatCard(props: StatCardProps): JSX.Element;
