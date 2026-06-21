import React from 'react';

const TONES = {
  neutral: { bg: 'var(--status-neutral-bg)', fg: 'var(--status-neutral-fg)', dot: 'var(--slate-400)' },
  brand:   { bg: 'var(--blue-50)', fg: 'var(--blue-700)', dot: 'var(--blue-600)' },
  success: { bg: 'var(--status-success-bg)', fg: 'var(--status-success-fg)', dot: 'var(--green-500)' },
  warning: { bg: 'var(--status-warning-bg)', fg: 'var(--status-warning-fg)', dot: 'var(--amber-500)' },
  danger:  { bg: 'var(--status-danger-bg)', fg: 'var(--status-danger-fg)', dot: 'var(--red-500)' },
  info:    { bg: 'var(--status-info-bg)', fg: 'var(--status-info-fg)', dot: 'var(--blue-500)' },
  violet:  { bg: 'var(--violet-50)', fg: 'var(--violet-600)', dot: 'var(--violet-500)' },
  teal:    { bg: 'var(--teal-50)', fg: 'var(--teal-600)', dot: 'var(--teal-500)' },
};

/**
 * Status / category badge. Optional leading status dot.
 */
export function Badge({ children, tone = 'neutral', dot = false, solid = false, size = 'md', style }) {
  const t = TONES[tone] || TONES.neutral;
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: pad,
      borderRadius: 'var(--radius-full)', fontSize: fs, fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--tracking-tight)', lineHeight: 1.4, whiteSpace: 'nowrap',
      background: solid ? t.dot : t.bg, color: solid ? '#fff' : t.fg,
      ...style,
    }}>
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: solid ? '#fff' : t.dot, flex: 'none' }} />}
      {children}
    </span>
  );
}
