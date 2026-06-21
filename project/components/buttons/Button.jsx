import React from 'react';

const SIZES = {
  sm: { height: 'var(--control-sm)', padding: '0 12px', font: 'var(--text-sm)', gap: '6px', radius: 'var(--radius-md)' },
  md: { height: 'var(--control-md)', padding: '0 16px', font: 'var(--text-base)', gap: '8px', radius: 'var(--radius-md)' },
  lg: { height: 'var(--control-lg)', padding: '0 20px', font: 'var(--text-md)', gap: '8px', radius: 'var(--radius-lg)' },
};

const VARIANTS = {
  primary: {
    background: 'var(--blue-600)', color: '#fff', border: '1px solid transparent',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), var(--shadow-brand)',
    '--hover-bg': 'var(--blue-700)', '--active-bg': 'var(--blue-800)',
  },
  secondary: {
    background: 'var(--slate-0)', color: 'var(--text-strong)', border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)',
    '--hover-bg': 'var(--slate-50)', '--active-bg': 'var(--slate-100)',
  },
  ghost: {
    background: 'transparent', color: 'var(--text-body)', border: '1px solid transparent',
    '--hover-bg': 'var(--slate-100)', '--active-bg': 'var(--slate-150)',
  },
  subtle: {
    background: 'var(--blue-50)', color: 'var(--blue-700)', border: '1px solid transparent',
    '--hover-bg': 'var(--blue-100)', '--active-bg': 'var(--blue-200)',
  },
  danger: {
    background: 'var(--red-600)', color: '#fff', border: '1px solid transparent',
    boxShadow: '0 4px 12px -2px rgba(217,45,32,.3)',
    '--hover-bg': 'var(--red-700)', '--active-bg': 'var(--red-700)',
  },
};

/**
 * Primary action button. Five variants, three sizes, optional icons.
 */
export function Button({
  children, variant = 'primary', size = 'md', iconLeft, iconRight,
  fullWidth = false, disabled = false, type = 'button', style, onClick, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const bg = active ? v['--active-bg'] : hover ? v['--hover-bg'] : v.background;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: s.padding, borderRadius: s.radius,
        fontFamily: 'var(--font-sans)', fontSize: s.font, fontWeight: 'var(--fw-semibold)',
        letterSpacing: 'var(--tracking-tight)', lineHeight: 1, whiteSpace: 'nowrap',
        background: bg, color: v.color, border: v.border, boxShadow: v.boxShadow,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: active && !disabled ? 'scale(0.98)' : 'scale(1)',
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', width: '1.05em', height: '1.05em' }}>{iconRight}</span>}
    </button>
  );
}
