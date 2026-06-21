import React from 'react';

const SIZES = {
  sm: { box: '30px', icon: '16px', radius: 'var(--radius-md)' },
  md: { box: '36px', icon: '18px', radius: 'var(--radius-md)' },
  lg: { box: '42px', icon: '20px', radius: 'var(--radius-lg)' },
};

const VARIANTS = {
  primary: { background: 'var(--blue-600)', color: '#fff', border: '1px solid transparent', boxShadow: 'var(--shadow-brand)', hover: 'var(--blue-700)' },
  secondary: { background: 'var(--slate-0)', color: 'var(--text-body)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)', hover: 'var(--slate-50)' },
  ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent', hover: 'var(--slate-100)' },
};

/**
 * Square icon-only button. Pass a single icon node as children.
 */
export function IconButton({ children, variant = 'ghost', size = 'md', label, disabled = false, style, onClick, ...rest }) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button" aria-label={label} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: s.box, height: s.box, borderRadius: s.radius,
        background: hover && !disabled ? v.hover : v.background,
        color: v.color, border: v.border, boxShadow: v.boxShadow,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-fast) var(--ease-out)', padding: 0,
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', width: s.icon, height: s.icon }}>{children}</span>
    </button>
  );
}
