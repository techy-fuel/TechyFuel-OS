import React from 'react';

/**
 * Toggle switch with spring-animated thumb.
 */
export function Switch({ checked, defaultChecked = false, onChange, disabled = false, size = 'md', label, id, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const switchId = id || React.useId();
  const dims = size === 'sm'
    ? { w: 34, h: 20, knob: 14, pad: 3 }
    : { w: 42, h: 24, knob: 18, pad: 3 };

  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(v => !v);
    onChange && onChange(!isOn);
  };

  const control = (
    <button
      type="button" role="switch" aria-checked={isOn} id={switchId} onClick={toggle} disabled={disabled}
      style={{
        position: 'relative', flex: 'none', width: dims.w, height: dims.h, padding: 0,
        borderRadius: 'var(--radius-full)', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: isOn ? 'var(--blue-600)' : 'var(--slate-300)',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--dur-base) var(--ease-out)',
        ...style,
      }}
    >
      <span style={{
        position: 'absolute', top: dims.pad, left: isOn ? dims.w - dims.knob - dims.pad : dims.pad,
        width: dims.knob, height: dims.knob, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 2px rgba(16,24,40,.25)',
        transition: 'left var(--dur-base) var(--ease-spring)',
      }} />
    </button>
  );

  if (!label) return control;
  return (
    <label htmlFor={switchId} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {control}
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-body)', fontWeight: 'var(--fw-medium)' }}>{label}</span>
    </label>
  );
}
