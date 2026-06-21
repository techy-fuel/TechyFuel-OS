import React from 'react';

/**
 * Surface container. The base building block — white, hairline + soft shadow.
 */
export function Card({ children, padding = 'md', interactive = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const pad = { none: 0, sm: '14px', md: '20px', lg: '24px' }[padding] ?? padding;
  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-2xl)', padding: pad,
        border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
