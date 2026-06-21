import React from 'react';

const TONES = { brand: 'var(--blue-600)', success: 'var(--green-500)', warning: 'var(--amber-500)', danger: 'var(--red-500)', violet: 'var(--violet-500)', teal: 'var(--teal-500)' };

/**
 * Linear progress / utilization bar. 0–100.
 */
export function ProgressBar({ value = 0, tone = 'brand', size = 'md', showLabel = false, label, style }) {
  const pct = Math.max(0, Math.min(100, value));
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const color = TONES[tone] || TONES.brand;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-muted)' }}>
          <span>{label}</span>{showLabel && <span style={{ color: 'var(--text-body)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>}
        </div>
      )}
      <div style={{ width: '100%', height: h, borderRadius: 'var(--radius-full)', background: 'var(--slate-150)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-full)', background: color, transition: 'width var(--dur-slow) var(--ease-out)' }} />
      </div>
    </div>
  );
}
