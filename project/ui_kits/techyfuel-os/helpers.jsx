// Shared helpers — Icon, Modal, form primitives.
function Icon({ name, size = 18, style, strokeWidth = 1.75 }) {
  return React.createElement('i', {
    'data-lucide': name,
    style: { width: size, height: size, display: 'inline-flex', strokeWidth, ...style },
  });
}

function useLucide() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

// ── Generic overlay modal ─────────────────────────────────────
function Modal({ open, onClose, title, children, onSubmit, loading, submitLabel }) {
  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-2xl)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: 480, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex', lineHeight: 1 }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 22px' }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', background: 'var(--slate-50)' }}>
          <button onClick={onClose} disabled={loading}
            style={{ height: 36, padding: '0 16px', background: 'var(--slate-0)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onSubmit} disabled={loading}
            style={{ height: 36, padding: '0 16px', background: 'var(--blue-600)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-brand)',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)',
              cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.75 : 1 }}>
            {loading ? 'Saving…' : (submitLabel || 'Save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form primitives ───────────────────────────────────────────
function FormRow({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
      <label style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-body)' }}>
        {label}{required && <span style={{ color: 'var(--red-500)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// Reusable field style objects
const FF = {
  input: {
    width: '100%', height: 36, padding: '0 10px',
    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
    background: 'var(--slate-0)', boxSizing: 'border-box', outline: 'none',
  },
  select: {
    width: '100%', height: 36, padding: '0 10px',
    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--text-strong)',
    background: 'var(--slate-0)', cursor: 'pointer', boxSizing: 'border-box', outline: 'none',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
};

Object.assign(window, { Icon, useLucide, Modal, FormRow, FF });
