import React from 'react';
import { Card } from './Card.jsx';

/**
 * KPI / metric tile for dashboards. Icon, value, label and signed delta.
 */
export function StatCard({ label, value, delta, deltaDirection, icon, tone = 'brand', sparkline, style }) {
  const dir = deltaDirection || (typeof delta === 'string' && delta.trim().startsWith('-') ? 'down' : 'up');
  const positive = dir === 'up';
  const tones = {
    brand: { bg: 'var(--blue-50)', fg: 'var(--blue-600)' },
    success: { bg: 'var(--green-50)', fg: 'var(--green-600)' },
    warning: { bg: 'var(--amber-50)', fg: 'var(--amber-600)' },
    danger: { bg: 'var(--red-50)', fg: 'var(--red-600)' },
    violet: { bg: 'var(--violet-50)', fg: 'var(--violet-600)' },
    teal: { bg: 'var(--teal-50)', fg: 'var(--teal-600)' },
  };
  const t = tones[tone] || tones.brand;
  return (
    <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '14px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        {icon && (
          <span style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-lg)', background: t.bg, color: t.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <span style={{ width: '18px', height: '18px', display: 'inline-flex' }}>{icon}</span>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 'var(--fw-extrabold)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-strong)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {delta != null && delta !== '—' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: positive ? 'var(--green-700)' : 'var(--red-700)', background: positive ? 'var(--green-50)' : 'var(--red-50)', borderRadius: 'var(--radius-full)', padding: '2px 8px 2px 5px', marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: positive ? 'none' : 'rotate(180deg)' }}><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg>
            {String(delta).replace(/^-/, '')}
          </span>
        )}
        {delta === '—' && (
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--text-subtle)', marginBottom: '5px' }}>—</span>
        )}
      </div>
      {sparkline}
    </Card>
  );
}
