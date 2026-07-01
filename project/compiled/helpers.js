// Shared helpers — Icon, Modal, form primitives.
//
// Icon renders real, React-owned <svg> elements built from lucide's icon
// data (window.lucide.icons) instead of the classic "render <i data-lucide>
// then call lucide.createIcons() to mutate it into an <svg>" pattern. That
// mutation happens outside React's virtual DOM, so whenever a re-render
// touched the same node afterward, React's reconciler could be asked to
// remove a child that lucide had already swapped out from under it —
// surfacing as "NotFoundError: Failed to execute 'removeChild'" crashes,
// intermittently, anywhere an icon's surrounding list/state changed.
function tfIconPascalName(name) {
  return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function Icon({
  name,
  size = 18,
  style,
  strokeWidth = 1.75
}) {
  const nodes = window.lucide && window.lucide.icons && window.lucide.icons[tfIconPascalName(name)];
  if (!nodes) {
    return React.createElement('span', {
      style: {
        width: size,
        height: size,
        display: 'inline-flex',
        flexShrink: 0,
        ...style
      }
    });
  }
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: {
      display: 'inline-flex',
      flexShrink: 0,
      ...style
    }
  }, nodes.map(([tag, attrs], i) => React.createElement(tag, {
    key: i,
    ...attrs
  })));
}

// Kept as a harmless no-op for any lingering callers — Icon no longer
// depends on lucide.createIcons() to render.
function useLucide() {}

// ── Generic overlay modal ─────────────────────────────────────
function Modal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading,
  submitLabel
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9000,
      background: 'rgba(15,23,42,0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    },
    onClick: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--slate-0)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: 480,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 22px',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      padding: 4,
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px'
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: '14px 22px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--slate-50)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    disabled: loading,
    style: {
      height: 36,
      padding: '0 16px',
      background: 'var(--slate-0)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)',
      cursor: 'pointer'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: onSubmit,
    disabled: loading,
    style: {
      height: 36,
      padding: '0 16px',
      background: 'var(--blue-600)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-brand)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      cursor: loading ? 'wait' : 'pointer',
      opacity: loading ? 0.75 : 1
    }
  }, loading ? 'Saving…' : submitLabel || 'Save'))));
}

// ── Form primitives ───────────────────────────────────────────
function FormRow({
  label,
  required,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-body)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--red-500)',
      marginLeft: 2
    }
  }, "*")), children);
}

// Reusable field style objects
const FF = {
  input: {
    width: '100%',
    height: 36,
    padding: '0 10px',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-strong)',
    background: 'var(--slate-0)',
    boxSizing: 'border-box',
    outline: 'none'
  },
  select: {
    width: '100%',
    height: 36,
    padding: '0 10px',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-strong)',
    background: 'var(--slate-0)',
    cursor: 'pointer',
    boxSizing: 'border-box',
    outline: 'none'
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  }
};
Object.assign(window, {
  Icon,
  useLucide,
  Modal,
  FormRow,
  FF
});