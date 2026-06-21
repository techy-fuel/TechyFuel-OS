import React from 'react';

/**
 * Checkbox with animated check, supporting indeterminate.
 */
export function Checkbox({ checked, defaultChecked = false, indeterminate = false, onChange, disabled = false, label, id, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const cbId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(v => !v);
    onChange && onChange(!isOn);
  };
  const filled = isOn || indeterminate;
  const box = (
    <button
      type="button" role="checkbox" aria-checked={indeterminate ? 'mixed' : isOn} id={cbId} onClick={toggle} disabled={disabled}
      style={{
        flex: 'none', width: '18px', height: '18px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-xs)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        background: filled ? 'var(--blue-600)' : 'var(--slate-0)',
        border: `1px solid ${filled ? 'var(--blue-600)' : 'var(--border-strong)'}`,
        boxShadow: filled ? 'none' : 'var(--shadow-inset)',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
    >
      {indeterminate ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14" /></svg>
      ) : isOn ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
      ) : null}
    </button>
  );
  if (!label) return box;
  return (
    <label htmlFor={cbId} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {box}
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{label}</span>
    </label>
  );
}
