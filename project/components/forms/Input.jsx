import React from 'react';

/**
 * Text input with optional leading icon, label and hint/error.
 */
export function Input({
  label, hint, error, iconLeft, size = 'md', disabled = false,
  id, style, containerStyle, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--red-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const ring = error ? 'var(--ring-danger)' : 'var(--ring-brand)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-strong)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {iconLeft && (
          <span style={{ position: 'absolute', left: '10px', display: 'inline-flex', width: '16px', height: '16px', color: 'var(--text-subtle)', pointerEvents: 'none' }}>
            {iconLeft}
          </span>
        )}
        <input
          id={inputId} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', height: h, boxSizing: 'border-box',
            padding: iconLeft ? '0 12px 0 34px' : '0 12px',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', color: 'var(--text-strong)',
            background: disabled ? 'var(--slate-50)' : 'var(--slate-0)',
            border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-md)',
            boxShadow: focus ? ring : 'var(--shadow-inset)',
            outline: 'none', transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
            cursor: disabled ? 'not-allowed' : 'text',
            ...style,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: 'var(--text-xs)', color: error ? 'var(--red-600)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
