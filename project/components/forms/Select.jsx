import React from 'react';

/**
 * Native select styled to match the input system, with chevron.
 */
export function Select({ label, hint, options = [], value, defaultValue, onChange, disabled = false, size = 'md', id, style, containerStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const selectId = id || React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
      {label && <label htmlFor={selectId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selectId} value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', height: h, boxSizing: 'border-box', appearance: 'none', WebkitAppearance: 'none',
            padding: '0 34px 0 12px', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
            color: 'var(--text-strong)', background: disabled ? 'var(--slate-50)' : 'var(--slate-0)',
            border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-brand)' : 'var(--shadow-inset)',
            outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
            ...style,
          }}
          {...rest}
        >
          {options.map(o => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: '10px', color: 'var(--text-subtle)', pointerEvents: 'none' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {hint && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}
