import React from 'react';

/**
 * Underline tab bar. Controlled or uncontrolled.
 * tabs: [{ id, label, count?, icon? }]
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultValue ?? tabs[0]?.id);
  const active = value !== undefined ? value : internal;
  const select = (id) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return (
    <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-subtle)', ...style }}>
      {tabs.map(tab => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id} type="button" onClick={() => select(tab.id)}
            style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '10px 12px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', fontWeight: 'var(--fw-semibold)',
              color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
              transition: 'color var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-body)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {tab.icon && <span style={{ width: '16px', height: '16px', display: 'inline-flex' }}>{tab.icon}</span>}
            {tab.label}
            {tab.count != null && (
              <span style={{
                fontSize: 'var(--text-2xs)', fontWeight: 'var(--fw-bold)', padding: '1px 7px', borderRadius: 'var(--radius-full)',
                background: isActive ? 'var(--blue-50)' : 'var(--slate-100)', color: isActive ? 'var(--blue-700)' : 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}>{tab.count}</span>
            )}
            <span style={{
              position: 'absolute', left: '8px', right: '8px', bottom: '-1px', height: '2px', borderRadius: '2px 2px 0 0',
              background: 'var(--blue-600)', opacity: isActive ? 1 : 0,
              transition: 'opacity var(--dur-fast) var(--ease-out)',
            }} />
          </button>
        );
      })}
    </div>
  );
}
