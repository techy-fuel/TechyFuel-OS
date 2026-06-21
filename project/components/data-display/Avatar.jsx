import React from 'react';

const SIZES = { xs: 22, sm: 28, md: 36, lg: 44, xl: 56 };
const PALETTE = ['var(--blue-600)', 'var(--violet-500)', 'var(--teal-600)', 'var(--amber-500)', 'var(--green-600)', 'var(--sky-600)'];

function initials(name = '') {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] || '').join('').toUpperCase() || '?';
}
function hashColor(name = '') {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

/**
 * User/client avatar — image, initials fallback, optional status ring.
 */
export function Avatar({ name = '', src, size = 'md', status, style }) {
  const dim = SIZES[size] || SIZES.md;
  const bg = hashColor(name);
  const statusColor = { online: 'var(--green-500)', busy: 'var(--red-500)', away: 'var(--amber-500)', offline: 'var(--slate-300)' }[status];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', width: dim, height: dim, ...style }}>
      {src ? (
        <img src={src} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block', boxShadow: 'inset 0 0 0 1px rgba(16,24,40,.08)' }} />
      ) : (
        <span style={{
          width: '100%', height: '100%', borderRadius: '50%', background: bg, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: dim * 0.4, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.01em',
        }}>{initials(name)}</span>
      )}
      {statusColor && (
        <span style={{
          position: 'absolute', right: -1, bottom: -1, width: dim * 0.3, height: dim * 0.3,
          minWidth: 8, minHeight: 8, borderRadius: '50%', background: statusColor,
          border: '2px solid var(--surface-card)',
        }} />
      )}
    </span>
  );
}

/**
 * Overlapping avatar stack with optional "+N" overflow chip.
 */
export function AvatarGroup({ people = [], max = 4, size = 'md' }) {
  const dim = SIZES[size] || SIZES.md;
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : -dim * 0.3, borderRadius: '50%', boxShadow: '0 0 0 2px var(--surface-card)' }}>
          <Avatar {...(typeof p === 'string' ? { name: p } : p)} size={size} />
        </span>
      ))}
      {extra > 0 && (
        <span style={{
          marginLeft: -dim * 0.3, width: dim, height: dim, borderRadius: '50%',
          background: 'var(--slate-100)', color: 'var(--text-muted)', boxShadow: '0 0 0 2px var(--surface-card)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: dim * 0.34, fontWeight: 'var(--fw-bold)',
        }}>+{extra}</span>
      )}
    </div>
  );
}
