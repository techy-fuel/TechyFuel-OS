/* @ds-bundle: {"format":3,"namespace":"TechyFuelOSDesignSystem_be0222","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"ProgressBar","sourcePath":"components/data-display/ProgressBar.jsx"},{"name":"StatCard","sourcePath":"components/data-display/StatCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"5dbd85d64615","components/buttons/IconButton.jsx":"56cc7abc8a46","components/data-display/Avatar.jsx":"dfbaed2a5c27","components/data-display/Badge.jsx":"c45735a2d50c","components/data-display/Card.jsx":"9df007603079","components/data-display/ProgressBar.jsx":"1f75190ad972","components/data-display/StatCard.jsx":"a3ef2d0a7b4b","components/forms/Checkbox.jsx":"473b9df59ac7","components/forms/Input.jsx":"021260aac3b8","components/forms/Select.jsx":"6612f6c41312","components/forms/Switch.jsx":"f81d99241a9c","components/navigation/Tabs.jsx":"45f06d6f0ed8","ui_kits/techyfuel-os/AIPanel.jsx":"f86a4af373cd","ui_kits/techyfuel-os/AppShell.jsx":"7aed9878f60b","ui_kits/techyfuel-os/CRM.jsx":"c40da46bae4b","ui_kits/techyfuel-os/ClientPortal.jsx":"43b4161b5858","ui_kits/techyfuel-os/ContentCalendar.jsx":"fb721640eedb","ui_kits/techyfuel-os/Dashboard.jsx":"8ab256ef2c7a","ui_kits/techyfuel-os/Files.jsx":"5c58ccf21f7c","ui_kits/techyfuel-os/Finance.jsx":"29bf4a678526","ui_kits/techyfuel-os/MetaAds.jsx":"4168d97d850e","ui_kits/techyfuel-os/Pipeline.jsx":"289c23287c69","ui_kits/techyfuel-os/Projects.jsx":"bf3647d9193e","ui_kits/techyfuel-os/Reports.jsx":"d334e93c8abe","ui_kits/techyfuel-os/Settings.jsx":"dfd791247134","ui_kits/techyfuel-os/TasksBoard.jsx":"c48ceb487f26","ui_kits/techyfuel-os/Team.jsx":"5efb6f179bc0","ui_kits/techyfuel-os/charts.jsx":"9568b19e9b0c","ui_kits/techyfuel-os/helpers.jsx":"6bfb801a39cf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TechyFuelOSDesignSystem_be0222 = window.TechyFuelOSDesignSystem_be0222 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    height: 'var(--control-sm)',
    padding: '0 12px',
    font: 'var(--text-sm)',
    gap: '6px',
    radius: 'var(--radius-md)'
  },
  md: {
    height: 'var(--control-md)',
    padding: '0 16px',
    font: 'var(--text-base)',
    gap: '8px',
    radius: 'var(--radius-md)'
  },
  lg: {
    height: 'var(--control-lg)',
    padding: '0 20px',
    font: 'var(--text-md)',
    gap: '8px',
    radius: 'var(--radius-lg)'
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--blue-600)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), var(--shadow-brand)',
    '--hover-bg': 'var(--blue-700)',
    '--active-bg': 'var(--blue-800)'
  },
  secondary: {
    background: 'var(--slate-0)',
    color: 'var(--text-strong)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)',
    '--hover-bg': 'var(--slate-50)',
    '--active-bg': 'var(--slate-100)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)',
    border: '1px solid transparent',
    '--hover-bg': 'var(--slate-100)',
    '--active-bg': 'var(--slate-150)'
  },
  subtle: {
    background: 'var(--blue-50)',
    color: 'var(--blue-700)',
    border: '1px solid transparent',
    '--hover-bg': 'var(--blue-100)',
    '--active-bg': 'var(--blue-200)'
  },
  danger: {
    background: 'var(--red-600)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: '0 4px 12px -2px rgba(217,45,32,.3)',
    '--hover-bg': 'var(--red-700)',
    '--active-bg': 'var(--red-700)'
  }
};

/**
 * Primary action button. Five variants, three sizes, optional icons.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  style,
  onClick,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const bg = active ? v['--active-bg'] : hover ? v['--hover-bg'] : v.background;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      height: s.height,
      padding: s.padding,
      borderRadius: s.radius,
      fontFamily: 'var(--font-sans)',
      fontSize: s.font,
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      background: bg,
      color: v.color,
      border: v.border,
      boxShadow: v.boxShadow,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transform: active && !disabled ? 'scale(0.98)' : 'scale(1)',
      transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: '1.05em',
      height: '1.05em'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: '1.05em',
      height: '1.05em'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    box: '30px',
    icon: '16px',
    radius: 'var(--radius-md)'
  },
  md: {
    box: '36px',
    icon: '18px',
    radius: 'var(--radius-md)'
  },
  lg: {
    box: '42px',
    icon: '20px',
    radius: 'var(--radius-lg)'
  }
};
const VARIANTS = {
  primary: {
    background: 'var(--blue-600)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-brand)',
    hover: 'var(--blue-700)'
  },
  secondary: {
    background: 'var(--slate-0)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)',
    hover: 'var(--slate-50)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent',
    hover: 'var(--slate-100)'
  }
};

/**
 * Square icon-only button. Pass a single icon node as children.
 */
function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  label,
  disabled = false,
  style,
  onClick,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: s.box,
      height: s.box,
      borderRadius: s.radius,
      background: hover && !disabled ? v.hover : v.background,
      color: v.color,
      border: v.border,
      boxShadow: v.boxShadow,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-out)',
      padding: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: s.icon,
      height: s.icon
    }
  }, children));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  xs: 22,
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56
};
const PALETTE = ['var(--blue-600)', 'var(--violet-500)', 'var(--teal-600)', 'var(--amber-500)', 'var(--green-600)', 'var(--sky-600)'];
function initials(name = '') {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] || '').join('').toUpperCase() || '?';
}
function hashColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

/**
 * User/client avatar — image, initials fallback, optional status ring.
 */
function Avatar({
  name = '',
  src,
  size = 'md',
  status,
  style
}) {
  const dim = SIZES[size] || SIZES.md;
  const bg = hashColor(name);
  const statusColor = {
    online: 'var(--green-500)',
    busy: 'var(--red-500)',
    away: 'var(--amber-500)',
    offline: 'var(--slate-300)'
  }[status];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none',
      width: dim,
      height: dim,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      display: 'block',
      boxShadow: 'inset 0 0 0 1px rgba(16,24,40,.08)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: bg,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: dim * 0.4,
      fontWeight: 'var(--fw-bold)',
      letterSpacing: '-0.01em'
    }
  }, initials(name)), statusColor && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: dim * 0.3,
      height: dim * 0.3,
      minWidth: 8,
      minHeight: 8,
      borderRadius: '50%',
      background: statusColor,
      border: '2px solid var(--surface-card)'
    }
  }));
}

/**
 * Overlapping avatar stack with optional "+N" overflow chip.
 */
function AvatarGroup({
  people = [],
  max = 4,
  size = 'md'
}) {
  const dim = SIZES[size] || SIZES.md;
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, shown.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i === 0 ? 0 : -dim * 0.3,
      borderRadius: '50%',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, _extends({}, typeof p === 'string' ? {
    name: p
  } : p, {
    size: size
  })))), extra > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: -dim * 0.3,
      width: dim,
      height: dim,
      borderRadius: '50%',
      background: 'var(--slate-100)',
      color: 'var(--text-muted)',
      boxShadow: '0 0 0 2px var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: dim * 0.34,
      fontWeight: 'var(--fw-bold)'
    }
  }, "+", extra));
}
Object.assign(__ds_scope, { Avatar, AvatarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
const TONES = {
  neutral: {
    bg: 'var(--status-neutral-bg)',
    fg: 'var(--status-neutral-fg)',
    dot: 'var(--slate-400)'
  },
  brand: {
    bg: 'var(--blue-50)',
    fg: 'var(--blue-700)',
    dot: 'var(--blue-600)'
  },
  success: {
    bg: 'var(--status-success-bg)',
    fg: 'var(--status-success-fg)',
    dot: 'var(--green-500)'
  },
  warning: {
    bg: 'var(--status-warning-bg)',
    fg: 'var(--status-warning-fg)',
    dot: 'var(--amber-500)'
  },
  danger: {
    bg: 'var(--status-danger-bg)',
    fg: 'var(--status-danger-fg)',
    dot: 'var(--red-500)'
  },
  info: {
    bg: 'var(--status-info-bg)',
    fg: 'var(--status-info-fg)',
    dot: 'var(--blue-500)'
  },
  violet: {
    bg: 'var(--violet-50)',
    fg: 'var(--violet-600)',
    dot: 'var(--violet-500)'
  },
  teal: {
    bg: 'var(--teal-50)',
    fg: 'var(--teal-600)',
    dot: 'var(--teal-500)'
  }
};

/**
 * Status / category badge. Optional leading status dot.
 */
function Badge({
  children,
  tone = 'neutral',
  dot = false,
  solid = false,
  size = 'md',
  style
}) {
  const t = TONES[tone] || TONES.neutral;
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: pad,
      borderRadius: 'var(--radius-full)',
      fontSize: fs,
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      background: solid ? t.dot : t.bg,
      color: solid ? '#fff' : t.fg,
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: solid ? '#fff' : t.dot,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface container. The base building block — white, hairline + soft shadow.
 */
function Card({
  children,
  padding = 'md',
  interactive = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pad = {
    none: 0,
    sm: '14px',
    md: '20px',
    lg: '24px'
  }[padding] ?? padding;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-2xl)',
      padding: pad,
      border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/ProgressBar.jsx
try { (() => {
const TONES = {
  brand: 'var(--blue-600)',
  success: 'var(--green-500)',
  warning: 'var(--amber-500)',
  danger: 'var(--red-500)',
  violet: 'var(--violet-500)',
  teal: 'var(--teal-500)'
};

/**
 * Linear progress / utilization bar. 0–100.
 */
function ProgressBar({
  value = 0,
  tone = 'brand',
  size = 'md',
  showLabel = false,
  label,
  style
}) {
  const pct = Math.max(0, Math.min(100, value));
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const color = TONES[tone] || TONES.brand;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '100%',
      ...style
    }
  }, (showLabel || label) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: h,
      borderRadius: 'var(--radius-full)',
      background: 'var(--slate-150)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: '100%',
      borderRadius: 'var(--radius-full)',
      background: color,
      transition: 'width var(--dur-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/StatCard.jsx
try { (() => {
/**
 * KPI / metric tile for dashboards. Icon, value, label and signed delta.
 */
function StatCard({
  label,
  value,
  delta,
  deltaDirection,
  icon,
  tone = 'brand',
  sparkline,
  style
}) {
  const dir = deltaDirection || (typeof delta === 'string' && delta.trim().startsWith('-') ? 'down' : 'up');
  const positive = dir === 'up';
  const tones = {
    brand: {
      bg: 'var(--blue-50)',
      fg: 'var(--blue-600)'
    },
    success: {
      bg: 'var(--green-50)',
      fg: 'var(--green-600)'
    },
    warning: {
      bg: 'var(--amber-50)',
      fg: 'var(--amber-600)'
    },
    danger: {
      bg: 'var(--red-50)',
      fg: 'var(--red-600)'
    },
    violet: {
      bg: 'var(--violet-50)',
      fg: 'var(--violet-600)'
    },
    teal: {
      bg: 'var(--teal-50)',
      fg: 'var(--teal-600)'
    }
  };
  const t = tones[tone] || tones.brand;
  return /*#__PURE__*/React.createElement(__ds_scope.Card, {
    padding: "md",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '34px',
      height: '34px',
      borderRadius: 'var(--radius-lg)',
      background: t.bg,
      color: t.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '18px',
      height: '18px',
      display: 'inline-flex'
    }
  }, icon))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '10px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-4xl)',
      fontWeight: 'var(--fw-extrabold)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-strong)',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), delta != null && delta !== '—' && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-bold)',
      color: positive ? 'var(--green-700)' : 'var(--red-700)',
      background: positive ? 'var(--green-50)' : 'var(--red-50)',
      borderRadius: 'var(--radius-full)',
      padding: '2px 8px 2px 5px',
      marginBottom: '4px',
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: positive ? 'none' : 'rotate(180deg)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 7-7 7 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 19V5"
  })), String(delta).replace(/^-/, '')), delta === '—' && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-subtle)',
      marginBottom: '5px'
    }
  }, "\u2014")), sparkline);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Checkbox with animated check, supporting indeterminate.
 */
function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  label,
  id,
  style
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const cbId = id || React.useId();
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(v => !v);
    onChange && onChange(!isOn);
  };
  const filled = isOn || indeterminate;
  const box = /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "checkbox",
    "aria-checked": indeterminate ? 'mixed' : isOn,
    id: cbId,
    onClick: toggle,
    disabled: disabled,
    style: {
      flex: 'none',
      width: '18px',
      height: '18px',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-xs)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      background: filled ? 'var(--blue-600)' : 'var(--slate-0)',
      border: `1px solid ${filled ? 'var(--blue-600)' : 'var(--border-strong)'}`,
      boxShadow: filled ? 'none' : 'var(--shadow-inset)',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  })) : isOn ? /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })) : null);
  if (!label) return box;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, box, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with optional leading icon, label and hint/error.
 */
function Input({
  label,
  hint,
  error,
  iconLeft,
  size = 'md',
  disabled = false,
  id,
  style,
  containerStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--red-500)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  const ring = error ? 'var(--ring-danger)' : 'var(--ring-brand)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '10px',
      display: 'inline-flex',
      width: '16px',
      height: '16px',
      color: 'var(--text-subtle)',
      pointerEvents: 'none'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: h,
      boxSizing: 'border-box',
      padding: iconLeft ? '0 12px 0 34px' : '0 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      background: disabled ? 'var(--slate-50)' : 'var(--slate-0)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? ring : 'var(--shadow-inset)',
      outline: 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      cursor: disabled ? 'not-allowed' : 'text',
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--red-600)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Native select styled to match the input system, with chevron.
 */
function Select({
  label,
  hint,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  size = 'md',
  id,
  style,
  containerStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-sm)' : size === 'lg' ? 'var(--control-lg)' : 'var(--control-md)';
  const selectId = id || React.useId();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: h,
      boxSizing: 'border-box',
      appearance: 'none',
      WebkitAppearance: 'none',
      padding: '0 34px 0 12px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-strong)',
      background: disabled ? 'var(--slate-50)' : 'var(--slate-0)',
      border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--ring-brand)' : 'var(--shadow-inset)',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, rest), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: 'absolute',
      right: '10px',
      color: 'var(--text-subtle)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Toggle switch with spring-animated thumb.
 */
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  id,
  style
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isOn = checked !== undefined ? checked : internal;
  const switchId = id || React.useId();
  const dims = size === 'sm' ? {
    w: 34,
    h: 20,
    knob: 14,
    pad: 3
  } : {
    w: 42,
    h: 24,
    knob: 18,
    pad: 3
  };
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInternal(v => !v);
    onChange && onChange(!isOn);
  };
  const control = /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": isOn,
    id: switchId,
    onClick: toggle,
    disabled: disabled,
    style: {
      position: 'relative',
      flex: 'none',
      width: dims.w,
      height: dims.h,
      padding: 0,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: isOn ? 'var(--blue-600)' : 'var(--slate-300)',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: dims.pad,
      left: isOn ? dims.w - dims.knob - dims.pad : dims.pad,
      width: dims.knob,
      height: dims.knob,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(16,24,40,.25)',
      transition: 'left var(--dur-base) var(--ease-spring)'
    }
  }));
  if (!label) return control;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }
  }, control, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-base)',
      color: 'var(--text-body)',
      fontWeight: 'var(--fw-medium)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * Underline tab bar. Controlled or uncontrolled.
 * tabs: [{ id, label, count?, icon? }]
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? tabs[0]?.id);
  const active = value !== undefined ? value : internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(tab => {
    const isActive = tab.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      type: "button",
      onClick: () => select(tab.id),
      style: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        padding: '10px 12px 12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-semibold)',
        color: isActive ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast) var(--ease-out)'
      },
      onMouseEnter: e => {
        if (!isActive) e.currentTarget.style.color = 'var(--text-body)';
      },
      onMouseLeave: e => {
        if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
      }
    }, tab.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        width: '16px',
        height: '16px',
        display: 'inline-flex'
      }
    }, tab.icon), tab.label, tab.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        padding: '1px 7px',
        borderRadius: 'var(--radius-full)',
        background: isActive ? 'var(--blue-50)' : 'var(--slate-100)',
        color: isActive ? 'var(--blue-700)' : 'var(--text-muted)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, tab.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '8px',
        right: '8px',
        bottom: '-1px',
        height: '2px',
        borderRadius: '2px 2px 0 0',
        background: 'var(--blue-600)',
        opacity: isActive ? 1 : 0,
        transition: 'opacity var(--dur-fast) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/AIPanel.jsx
try { (() => {
// AI Assistant — glass slide-over panel, available across all screens.
(() => {
  const {
    Avatar,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_AI_SUGGEST = ['Summarize this week', 'Draft 6 captions', 'Detect deadline risks', 'Generate proposal'];
  const TF_AI_THREAD = [{
    role: 'user',
    text: "What's at risk this week?"
  }, {
    role: 'ai',
    text: "I scanned 24 open tasks across 3 projects. Two need attention:",
    cards: [{
      icon: 'alert-triangle',
      tone: 'warning',
      title: 'Nova — launch campaign',
      body: 'Due today, 82% complete. 1 task still in review.'
    }, {
      icon: 'clock',
      tone: 'danger',
      title: 'Meta ad creatives v3',
      body: 'Urgent · due today · assigned to Sara, no update in 2 days.'
    }]
  }, {
    role: 'ai',
    text: 'Want me to nudge the owners and draft a status note for the clients?'
  }];
  function AIPanel({
    open,
    onClose
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(16,24,40,0.28)',
        backdropFilter: 'blur(2px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity var(--dur-base) var(--ease-out)',
        zIndex: 40
      }
    }), /*#__PURE__*/React.createElement("aside", {
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: 384,
        maxWidth: '92vw',
        zIndex: 50,
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderLeft: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-2xl)',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform var(--dur-slow) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, "AI Assistant"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: 'var(--green-500)'
      }
    }), " Online \xB7 sees your workspace")), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        width: 30,
        height: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "x",
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, TF_AI_THREAD.map((m, i) => m.role === 'user' ? /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: 'flex-end',
        maxWidth: '85%',
        background: 'var(--blue-600)',
        color: '#fff',
        padding: '9px 13px',
        borderRadius: '14px 14px 4px 14px',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        boxShadow: 'var(--shadow-brand)'
      }
    }, m.text) : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        maxWidth: '92%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        padding: '10px 13px',
        borderRadius: '14px 14px 14px 4px',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.5,
        boxShadow: 'var(--shadow-xs)'
      }
    }, m.text), m.cards && m.cards.map((c, j) => {
      const tones = {
        warning: ['var(--amber-50)', 'var(--amber-600)'],
        danger: ['var(--red-50)', 'var(--red-600)']
      };
      const [bg, fg] = tones[c.tone];
      return /*#__PURE__*/React.createElement("div", {
        key: j,
        style: {
          display: 'flex',
          gap: 10,
          background: 'var(--slate-0)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 11,
          boxShadow: 'var(--shadow-xs)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 28,
          height: 28,
          flex: 'none',
          borderRadius: 'var(--radius-md)',
          background: bg,
          color: fg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: c.icon,
        size: 15
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, c.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          marginTop: 1,
          lineHeight: 1.4
        }
      }, c.body)));
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 34,
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14
    }), " Nudge owners"), /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 34,
        background: 'var(--slate-0)',
        color: 'var(--text-body)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 14
    }), " Draft note"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 10
      }
    }, TF_AI_SUGGEST.map(s => /*#__PURE__*/React.createElement("span", {
      key: s,
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--blue-700)',
        background: 'var(--blue-50)',
        borderRadius: 'var(--radius-full)',
        padding: '4px 10px',
        cursor: 'pointer'
      }
    }, s))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '7px 8px 7px 13px',
        boxShadow: 'var(--shadow-inset)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-subtle)'
      }
    }, "Ask anything about your agency\u2026"), /*#__PURE__*/React.createElement("button", {
      style: {
        width: 32,
        height: 32,
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up",
      size: 17
    }))))));
  }
  Object.assign(window, {
    AIPanel
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/AIPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/AppShell.jsx
try { (() => {
// App shell: left sidebar + glass top bar + content area.
(() => {
  const {
    IconButton,
    Avatar,
    Badge
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_NAV = [{
    group: 'Workspace',
    items: [{
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'layout-dashboard'
    }, {
      id: 'tasks',
      label: 'Tasks',
      icon: 'circle-check-big',
      badge: '24'
    }, {
      id: 'projects',
      label: 'Projects',
      icon: 'folder-kanban'
    }, {
      id: 'calendar',
      label: 'Calendar',
      icon: 'calendar-days'
    }]
  }, {
    group: 'Clients',
    items: [{
      id: 'crm',
      label: 'Client CRM',
      icon: 'contact'
    }, {
      id: 'pipeline',
      label: 'Sales pipeline',
      icon: 'filter'
    }, {
      id: 'portal',
      label: 'Client portal',
      icon: 'panel-left-open'
    }]
  }, {
    group: 'Marketing',
    items: [{
      id: 'content',
      label: 'Content',
      icon: 'calendar-clock'
    }, {
      id: 'ads',
      label: 'Meta Ads',
      icon: 'megaphone'
    }]
  }, {
    group: 'Business',
    items: [{
      id: 'finance',
      label: 'Finance',
      icon: 'wallet'
    }, {
      id: 'reports',
      label: 'Reports',
      icon: 'chart-line'
    }, {
      id: 'files',
      label: 'Files',
      icon: 'folder'
    }, {
      id: 'team',
      label: 'Team',
      icon: 'users'
    }, {
      id: 'settings',
      label: 'Settings',
      icon: 'settings'
    }]
  }];
  function SidebarItem({
    item,
    active,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: 'var(--fw-medium)',
        background: active ? 'var(--blue-50)' : hover ? 'var(--slate-100)' : 'transparent',
        color: active ? 'var(--blue-700)' : 'var(--text-body)',
        transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 18,
      style: {
        color: active ? 'var(--blue-600)' : 'var(--text-muted)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, item.label), item.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        color: active ? 'var(--blue-700)' : 'var(--text-muted)',
        background: active ? 'var(--blue-100)' : 'var(--slate-150)',
        borderRadius: 'var(--radius-full)',
        padding: '1px 7px',
        fontVariantNumeric: 'tabular-nums'
      }
    }, item.badge));
  }
  function Sidebar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 'var(--sidebar-width)',
        flex: 'none',
        height: '100%',
        boxSizing: 'border-box',
        background: 'var(--slate-0)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '0 16px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/techyfuel-mark.png",
      alt: "",
      style: {
        height: 26
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--fw-extrabold)',
        fontSize: 'var(--text-lg)',
        letterSpacing: '-0.02em',
        color: 'var(--text-strong)'
      }
    }, "TechyFuel", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--blue-600)'
      }
    }, " OS"))), /*#__PURE__*/React.createElement("nav", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '12px 12px 8px'
      }
    }, TF_NAV.map(section => /*#__PURE__*/React.createElement("div", {
      key: section.group,
      style: {
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        padding: '0 10px 6px'
      }
    }, section.group), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, section.items.map(it => /*#__PURE__*/React.createElement(SidebarItem, {
      key: it.id,
      item: it,
      active: active === it.id,
      onClick: () => onNavigate(it.id)
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-50)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Bright Pixel",
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, "Bright Pixel Co."), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-muted)'
      }
    }, "Pro \xB7 14 seats")), /*#__PURE__*/React.createElement(Icon, {
      name: "chevrons-up-down",
      size: 16,
      style: {
        color: 'var(--text-subtle)'
      }
    }))));
  }
  function TopBar({
    title,
    crumb,
    onOpenAI
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--topbar-height)',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 24px',
        boxSizing: 'border-box',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, crumb), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 15,
      style: {
        color: 'var(--text-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: 280,
        maxWidth: '32vw',
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-50)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16,
      style: {
        color: 'var(--text-subtle)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-subtle)'
      }
    }, "Search or ask AI\u2026"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xs)',
        padding: '1px 5px'
      }
    }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
      onClick: onOpenAI,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 13px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--grad-brand)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16
    }), " Ask AI"), /*#__PURE__*/React.createElement(IconButton, {
      label: "Notifications",
      variant: "ghost"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 18
    })), /*#__PURE__*/React.createElement(Avatar, {
      name: "Sara Khan",
      status: "online"
    }));
  }
  function AppShell({
    active,
    onNavigate,
    title,
    crumb,
    onOpenAI,
    children
  }) {
    useLucide();
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      onNavigate: onNavigate
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(TopBar, {
      title: title,
      crumb: crumb,
      onOpenAI: onOpenAI
    }), /*#__PURE__*/React.createElement("main", {
      className: "tf-scroll",
      style: {
        flex: 1,
        overflowY: 'auto'
      }
    }, children)));
  }
  Object.assign(window, {
    AppShell,
    Sidebar,
    TopBar
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/CRM.jsx
try { (() => {
// Client CRM screen — table + selectable profile panel.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Tabs,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_STATUS = {
    lead: {
      tone: 'brand',
      label: 'Lead'
    },
    proposal: {
      tone: 'violet',
      label: 'Proposal sent'
    },
    negotiation: {
      tone: 'warning',
      label: 'Negotiation'
    },
    active: {
      tone: 'success',
      label: 'Active client'
    },
    completed: {
      tone: 'neutral',
      label: 'Completed'
    },
    lost: {
      tone: 'danger',
      label: 'Lost'
    }
  };
  const TF_CLIENTS_DATA = [{
    id: 1,
    company: 'Nova Skincare',
    contact: 'Amelia Stone',
    email: 'amelia@novaskin.co',
    country: '🇺🇸 United States',
    industry: 'E-commerce',
    status: 'active',
    value: '$12,400',
    source: 'Referral',
    site: 'novaskin.co',
    wa: '+1 415 555 0182'
  }, {
    id: 2,
    company: 'Orbit Inc.',
    contact: 'Daniel Wu',
    email: 'dan@orbit.io',
    country: '🇬🇧 United Kingdom',
    industry: 'SaaS',
    status: 'active',
    value: '$28,900',
    source: 'Inbound',
    site: 'orbit.io',
    wa: '+44 20 7946 0958'
  }, {
    id: 3,
    company: 'Mediva Health',
    contact: 'Priya Nair',
    email: 'priya@mediva.health',
    country: '🇦🇪 UAE',
    industry: 'Healthcare',
    status: 'negotiation',
    value: '$18,000',
    source: 'LinkedIn',
    site: 'mediva.health',
    wa: '+971 50 123 4567'
  }, {
    id: 4,
    company: 'Peak Fitness',
    contact: 'Marco Bianchi',
    email: 'marco@peakfit.com',
    country: '🇮🇹 Italy',
    industry: 'Fitness',
    status: 'active',
    value: '$9,200',
    source: 'Referral',
    site: 'peakfit.com',
    wa: '+39 06 5555 123'
  }, {
    id: 5,
    company: 'Lumen Cafe',
    contact: 'Sofia Reyes',
    email: 'sofia@lumencafe.com',
    country: '🇪🇸 Spain',
    industry: 'Hospitality',
    status: 'proposal',
    value: '$6,500',
    source: 'Instagram',
    site: 'lumencafe.com',
    wa: '+34 91 555 0199'
  }, {
    id: 6,
    company: 'Atlas Realty',
    contact: 'James Carter',
    email: 'james@atlasrealty.com',
    country: '🇺🇸 United States',
    industry: 'Real estate',
    status: 'lead',
    value: '$15,000',
    source: 'Cold outreach',
    site: 'atlasrealty.com',
    wa: '+1 212 555 0143'
  }, {
    id: 7,
    company: 'Verde Foods',
    contact: 'Lena Müller',
    email: 'lena@verdefoods.de',
    country: '🇩🇪 Germany',
    industry: 'CPG',
    status: 'completed',
    value: '$22,300',
    source: 'Referral',
    site: 'verdefoods.de',
    wa: '+49 30 5555 012'
  }];
  const TF_TIMELINE = [{
    icon: 'phone',
    tone: 'brand',
    text: 'Discovery call completed',
    time: 'Jun 18 · 32 min'
  }, {
    icon: 'file-text',
    tone: 'violet',
    text: 'Proposal v2 sent ($12,400/mo retainer)',
    time: 'Jun 15'
  }, {
    icon: 'mail',
    tone: 'success',
    text: 'Replied to onboarding email',
    time: 'Jun 12'
  }, {
    icon: 'calendar-check',
    tone: 'warning',
    text: 'Kickoff meeting scheduled',
    time: 'Jun 10'
  }];
  function Th({
    children,
    w
  }) {
    return /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'left',
        padding: '0 14px 10px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        width: w
      }
    }, children);
  }
  function ClientRow({
    c,
    selected,
    onClick
  }) {
    const [hover, setHover] = React.useState(false);
    const s = TF_STATUS[c.status];
    return /*#__PURE__*/React.createElement("tr", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        cursor: 'pointer',
        background: selected ? 'var(--blue-50)' : hover ? 'var(--slate-50)' : 'transparent',
        transition: 'background var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.company,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, c.company), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, c.site)))), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.contact), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.industry), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)'
      }
    }, c.country), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '11px 14px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums'
      }
    }, c.value));
  }
  function ProfileField({
    icon,
    label,
    value
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 16,
      style: {
        color: 'var(--text-subtle)',
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        width: 76,
        flex: 'none'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-medium)',
        textAlign: 'right',
        flex: 1
      }
    }, value));
  }
  function CRM() {
    const [selId, setSelId] = React.useState(1);
    const sel = TF_CLIENTS_DATA.find(c => c.id === selId);
    const s = TF_STATUS[sel.status];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Client CRM"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "38 clients \xB7 $112.7K in active retainers")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 16
    }), " Add client")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 230
      }
    }, /*#__PURE__*/React.createElement(Input, {
      size: "sm",
      placeholder: "Search clients\u2026",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 30,
        padding: '0 11px',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "filter",
      size: 15,
      style: {
        color: 'var(--text-muted)'
      }
    }), " Status"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "7 of 38")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(Th, null, "Company"), /*#__PURE__*/React.createElement(Th, null, "Contact"), /*#__PURE__*/React.createElement(Th, null, "Status"), /*#__PURE__*/React.createElement(Th, null, "Industry"), /*#__PURE__*/React.createElement(Th, null, "Country"), /*#__PURE__*/React.createElement(Th, {
      w: "90"
    }, "Value"))), /*#__PURE__*/React.createElement("tbody", null, TF_CLIENTS_DATA.map(c => /*#__PURE__*/React.createElement(ClientRow, {
      key: c.id,
      c: c,
      selected: c.id === selId,
      onClick: () => setSelId(c.id)
    }))))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: 'hidden',
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-hero)',
        padding: '20px 18px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: sel.company,
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, sel.company), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      dot: true
    }, s.label)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 14
      }
    }, [['mail', 'Email'], ['message-circle', 'WhatsApp'], ['calendar-plus', 'Meeting']].map(([ic, l]) => /*#__PURE__*/React.createElement("button", {
      key: l,
      style: {
        flex: 1,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '8px 0',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      style: {
        color: 'var(--blue-600)'
      }
    }), " ", l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 18px 14px'
      }
    }, /*#__PURE__*/React.createElement(ProfileField, {
      icon: "user",
      label: "Contact",
      value: sel.contact
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "at-sign",
      label: "Email",
      value: sel.email
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "globe",
      label: "Website",
      value: sel.site
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "target",
      label: "Source",
      value: sel.source
    }), /*#__PURE__*/React.createElement(ProfileField, {
      icon: "banknote",
      label: "Value",
      value: sel.value + '/mo'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 18px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)',
        marginBottom: 10
      }
    }, "Communication timeline"), /*#__PURE__*/React.createElement("div", null, TF_TIMELINE.map((t, i) => {
      const tones = {
        brand: 'var(--blue-600)',
        violet: 'var(--violet-500)',
        success: 'var(--green-500)',
        warning: 'var(--amber-500)'
      };
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 10,
          paddingBottom: i < TF_TIMELINE.length - 1 ? 12 : 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--slate-50)',
          border: '1px solid var(--border-default)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: tones[t.tone]
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 13
      })), i < TF_TIMELINE.length - 1 && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 1.5,
          flex: 1,
          background: 'var(--border-default)',
          marginTop: 3
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          paddingBottom: 2
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          lineHeight: 1.4
        }
      }, t.text), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-subtle)',
          marginTop: 1
        }
      }, t.time)));
    }))))));
  }
  Object.assign(window, {
    CRM
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/CRM.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/ClientPortal.jsx
try { (() => {
// Client Portal screen — the client-facing view (previewed inside the agency app).
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_MILESTONES = [{
    label: 'Discovery & strategy',
    state: 'done'
  }, {
    label: 'Brand & creative direction',
    state: 'done'
  }, {
    label: 'Campaign production',
    state: 'active'
  }, {
    label: 'Launch & optimization',
    state: 'todo'
  }, {
    label: 'Reporting & handover',
    state: 'todo'
  }];
  const TF_APPROVALS = [{
    name: 'Homepage hero — v3',
    type: 'Design',
    who: 'Sara Khan',
    time: '2h ago',
    status: 'pending'
  }, {
    name: 'Launch reel — 30s cut',
    type: 'Video',
    who: 'Omar Ali',
    time: 'Yesterday',
    status: 'pending'
  }, {
    name: 'Instagram carousel set',
    type: 'Social',
    who: 'Lena Cruz',
    time: 'Jun 18',
    status: 'approved'
  }];
  const TF_FILES = [{
    name: 'Brand guidelines.pdf',
    size: '4.2 MB',
    icon: 'file-text',
    tone: 'var(--red-500)'
  }, {
    name: 'Launch hero.png',
    size: '1.8 MB',
    icon: 'image',
    tone: 'var(--violet-500)'
  }, {
    name: 'Campaign reel.mp4',
    size: '38 MB',
    icon: 'video',
    tone: 'var(--blue-500)'
  }, {
    name: 'Service agreement.pdf',
    size: '320 KB',
    icon: 'file-check',
    tone: 'var(--green-500)'
  }];
  function ClientPortal() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grad-brand)',
        padding: '26px 24px',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(255,255,255,0.16)',
        backdropFilter: 'blur(8px)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.25)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "panel-left-open",
      size: 22,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        opacity: 0.85
      }
    }, "Client portal \xB7 preview"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Nova Skincare workspace"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22
      }
    }, [['Project health', 'On track'], ['Next milestone', 'Jun 28'], ['Your manager', 'Sara K.']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        opacity: 0.8
      }
    }, k), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)'
      }
    }, v)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: 24,
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        gridColumn: '1 / -1'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Project progress"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "62% complete")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, TF_MILESTONES.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 9,
        position: 'relative'
      }
    }, i < TF_MILESTONES.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 15,
        left: '50%',
        width: '100%',
        height: 2,
        background: m.state === 'done' ? 'var(--blue-500)' : 'var(--border-default)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        zIndex: 1,
        width: 32,
        height: 32,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: m.state === 'done' ? 'var(--blue-600)' : m.state === 'active' ? 'var(--slate-0)' : 'var(--slate-100)',
        border: m.state === 'active' ? '2px solid var(--blue-600)' : '2px solid transparent',
        color: m.state === 'done' ? '#fff' : m.state === 'active' ? 'var(--blue-600)' : 'var(--text-subtle)'
      }
    }, m.state === 'done' ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    }) : m.state === 'active' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: '50%',
        background: 'var(--blue-600)'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700
      }
    }, i + 1)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: m.state === 'active' ? 'var(--fw-bold)' : 'var(--fw-medium)',
        color: m.state === 'todo' ? 'var(--text-subtle)' : 'var(--text-strong)',
        textAlign: 'center',
        lineHeight: 1.3
      }
    }, m.label))))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Awaiting your approval"), /*#__PURE__*/React.createElement(Badge, {
      tone: "warning"
    }, "2 pending")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, TF_APPROVALS.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: 'var(--slate-50)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 38,
        height: 38,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.type === 'Video' ? 'video' : a.type === 'Social' ? 'instagram' : 'image',
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, a.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, a.who, " \xB7 ", a.time)), a.status === 'approved' ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Approved") : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        width: 32,
        height: 32,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--green-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        width: 32,
        height: 32,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--slate-0)',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotate-ccw",
      size: 15
    }))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Shared files"), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'All files') : null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, TF_FILES.map((f, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '8px 6px',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: f.icon,
      size: 18,
      style: {
        color: f.tone,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        color: 'var(--text-strong)'
      }
    }, f.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, f.size), /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 16,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }))))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg",
      style: {
        background: 'var(--slate-900)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--slate-400)'
      }
    }, "Latest invoice"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        color: '#fff',
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$12,400"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--slate-400)',
        marginTop: 2
      }
    }, "INV-2026-0481 \xB7 due Jun 30")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 38,
        padding: '0 16px',
        background: '#fff',
        color: 'var(--slate-900)',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 16
    }), " Download"))))));
  }
  Object.assign(window, {
    ClientPortal
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/ClientPortal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/ContentCalendar.jsx
try { (() => {
// Content calendar screen — weekly social planner.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PLAT = {
    instagram: ['instagram', 'var(--violet-500)'],
    facebook: ['facebook', 'var(--blue-600)'],
    linkedin: ['linkedin', 'var(--sky-600)'],
    youtube: ['youtube', 'var(--red-500)'],
    tiktok: ['music', 'var(--slate-900)']
  };
  const DAYS = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'];
  const POSTS = {
    0: [{
      p: 'instagram',
      t: 'Reel — morning routine',
      s: 'scheduled',
      who: 'Lena Cruz'
    }, {
      p: 'facebook',
      t: 'Carousel — 5 tips',
      s: 'draft',
      who: 'Omar Ali'
    }],
    1: [{
      p: 'linkedin',
      t: 'Founder story post',
      s: 'approval',
      who: 'Sara Khan'
    }],
    2: [{
      p: 'youtube',
      t: 'Product demo (long)',
      s: 'scheduled',
      who: 'Omar Ali'
    }, {
      p: 'tiktok',
      t: 'Trend remix',
      s: 'draft',
      who: 'Lena Cruz'
    }],
    3: [{
      p: 'instagram',
      t: 'UGC repost',
      s: 'scheduled',
      who: 'Lena Cruz'
    }],
    4: [{
      p: 'instagram',
      t: 'Launch teaser',
      s: 'approval',
      who: 'Sara Khan'
    }, {
      p: 'facebook',
      t: 'Event promo',
      s: 'scheduled',
      who: 'Omar Ali'
    }],
    5: [],
    6: [{
      p: 'linkedin',
      t: 'Weekly recap',
      s: 'draft',
      who: 'Sara Khan'
    }]
  };
  const SS = {
    scheduled: ['success', 'Scheduled'],
    draft: ['neutral', 'Draft'],
    approval: ['warning', 'Approval']
  };
  function PostCard({
    post
  }) {
    const [pi, pc] = PLAT[post.p];
    const [st, sl] = SS[post.s];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 9,
        boxShadow: 'var(--shadow-xs)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--slate-50)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: pc
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: pi,
      size: 13
    })), /*#__PURE__*/React.createElement(Badge, {
      tone: st,
      size: "sm"
    }, sl)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        lineHeight: 1.35
      }
    }, post.t));
  }
  function ContentCalendar() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Content calendar"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "Week of Jun 23 \xB7 9 posts across 5 platforms")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 36,
        padding: '0 10px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 16,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, "This week"), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " Plan post"))), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }
    }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderRight: i < 6 ? '1px solid var(--border-subtle)' : 'none',
        minHeight: 360
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '11px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: i === 4 ? 'var(--blue-700)' : 'var(--text-strong)',
        background: i === 4 ? 'var(--blue-50)' : 'transparent'
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, (POSTS[i] || []).map((p, j) => /*#__PURE__*/React.createElement(PostCard, {
      key: j,
      post: p
    }))))))));
  }
  Object.assign(window, {
    ContentCalendar
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/ContentCalendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Dashboard.jsx
try { (() => {
// Executive Dashboard screen.
(() => {
  const {
    StatCard,
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_REVENUE = [22, 26, 24, 31, 29, 35, 38, 36, 42, 40, 45, 48.2];
  const TF_CLIENTS = [9, 11, 12, 14, 15, 18, 19, 22, 24, 26, 29, 32];
  function SectionHead({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, title), action);
  }
  function LinkBtn({
    children
  }) {
    return /*#__PURE__*/React.createElement("button", {
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--text-link)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer',
        padding: 0
      }
    }, children);
  }
  const TF_ACTIVITY = [{
    who: 'Sara Khan',
    action: 'approved the homepage design for',
    target: 'Nova Skincare',
    time: '12m',
    icon: 'check',
    tone: 'success'
  }, {
    who: 'Omar Ali',
    action: 'uploaded 6 reels to',
    target: 'Peak Fitness',
    time: '48m',
    icon: 'upload',
    tone: 'brand'
  }, {
    who: 'Lena Cruz',
    action: 'sent invoice INV-0481 to',
    target: 'Acme Studio',
    time: '2h',
    icon: 'receipt',
    tone: 'violet'
  }, {
    who: 'AI Assistant',
    action: 'flagged a deadline risk on',
    target: 'Orbit Web Build',
    time: '3h',
    icon: 'sparkles',
    tone: 'warning'
  }, {
    who: 'Tom Reed',
    action: 'won the deal with',
    target: 'Mediva Health',
    time: '5h',
    icon: 'trophy',
    tone: 'success'
  }];
  const TF_DEADLINES = [{
    project: 'Nova — launch campaign',
    client: 'Nova Skincare',
    due: 'Today',
    urgent: true,
    pct: 82,
    team: ['Sara Khan', 'Omar Ali']
  }, {
    project: 'Orbit — web build phase 2',
    client: 'Orbit Inc.',
    due: 'Tomorrow',
    pct: 64,
    team: ['Jay Park', 'Mia Wu', 'Tom Reed']
  }, {
    project: 'Peak — monthly content',
    client: 'Peak Fitness',
    due: 'Jun 24',
    pct: 45,
    team: ['Omar Ali', 'Lena Cruz']
  }, {
    project: 'Mediva — brand kit',
    client: 'Mediva Health',
    due: 'Jun 27',
    pct: 20,
    team: ['Sara Khan']
  }];
  function ActivityRow({
    a
  }) {
    const tones = {
      success: ['var(--green-50)', 'var(--green-600)'],
      brand: ['var(--blue-50)', 'var(--blue-600)'],
      violet: ['var(--violet-50)', 'var(--violet-600)'],
      warning: ['var(--amber-50)', 'var(--amber-600)']
    };
    const [bg, fg] = tones[a.tone] || tones.brand;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        padding: '10px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 30,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: bg,
        color: fg,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: a.icon,
      size: 15
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-body)',
        lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, a.who), " ", a.action, " ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, a.target)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        whiteSpace: 'nowrap'
      }
    }, a.time));
  }
  function Dashboard() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 4
      }
    }, "Good morning, Sara"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Executive dashboard")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), " This month ", /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-down",
      size: 15,
      style: {
        color: 'var(--text-subtle)'
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " New project"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Monthly revenue",
      value: "$48,250",
      delta: "12.5%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "dollar-sign"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active projects",
      value: "27",
      delta: "4.0%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "folder-kanban"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Outstanding",
      value: "$9,420",
      delta: "-3.1%",
      deltaDirection: "down",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt"
      }),
      tone: "warning"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Active clients",
      value: "38",
      delta: "6.2%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "users"
      }),
      tone: "violet"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Revenue growth",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "success",
        dot: true
      }, "+24% YTD")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$432.6K"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)'
      }
    }, "last 12 months")), /*#__PURE__*/React.createElement(AreaLine, {
      data: TF_REVENUE,
      id: "rev"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 8,
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Jul"), /*#__PURE__*/React.createElement("span", null, "Sep"), /*#__PURE__*/React.createElement("span", null, "Nov"), /*#__PURE__*/React.createElement("span", null, "Jan"), /*#__PURE__*/React.createElement("span", null, "Mar"), /*#__PURE__*/React.createElement("span", null, "May"))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Project status"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Donut, {
      segments: [{
        value: 11,
        color: 'var(--blue-600)'
      }, {
        value: 7,
        color: 'var(--sky-500)'
      }, {
        value: 5,
        color: 'var(--violet-500)'
      }, {
        value: 4,
        color: 'var(--green-500)'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1
      }
    }, [['In progress', 11, 'var(--blue-600)'], ['Review', 7, 'var(--sky-500)'], ['Client approval', 5, 'var(--violet-500)'], ['Completed', 4, 'var(--green-500)']].map(([l, n, c]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: c,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--text-body)'
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, n))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Recent activity",
      action: /*#__PURE__*/React.createElement(LinkBtn, null, "View all")
    }), /*#__PURE__*/React.createElement("div", null, TF_ACTIVITY.map((a, i) => /*#__PURE__*/React.createElement(ActivityRow, {
      key: i,
      a: a
    })))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement(SectionHead, {
      title: "Upcoming deadlines",
      action: /*#__PURE__*/React.createElement(LinkBtn, null, "Open calendar")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, TF_DEADLINES.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, d.project), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, d.client)), /*#__PURE__*/React.createElement(AvatarGroup, {
      people: d.team,
      size: "xs",
      max: 3
    }), /*#__PURE__*/React.createElement(Badge, {
      tone: d.urgent ? 'danger' : 'neutral',
      dot: d.urgent
    }, d.due)), /*#__PURE__*/React.createElement(ProgressBar, {
      value: d.pct,
      tone: d.urgent ? 'warning' : 'brand',
      size: "sm"
    })))))));
  }
  Object.assign(window, {
    Dashboard,
    TFSectionHead: SectionHead,
    TFLinkBtn: LinkBtn
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Files.jsx
try { (() => {
// Files screen — folder manager.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup
  } = window.TechyFuelOSDesignSystem_be0222;
  const FOLDERS = [{
    name: 'Designs',
    count: 248,
    color: 'var(--violet-500)',
    bg: 'var(--violet-50)',
    icon: 'palette',
    size: '4.2 GB'
  }, {
    name: 'Videos',
    count: 86,
    color: 'var(--teal-500)',
    bg: 'var(--teal-50)',
    icon: 'film',
    size: '38 GB'
  }, {
    name: 'Documents',
    count: 412,
    color: 'var(--blue-500)',
    bg: 'var(--blue-50)',
    icon: 'file-text',
    size: '1.1 GB'
  }, {
    name: 'Contracts',
    count: 64,
    color: 'var(--green-500)',
    bg: 'var(--green-50)',
    icon: 'file-check',
    size: '320 MB'
  }];
  const FILES = [{
    name: 'Nova — launch hero v3.fig',
    icon: 'figma',
    tone: 'var(--violet-500)',
    size: '12 MB',
    who: 'Sara Khan',
    when: '2h ago',
    v: 'v3'
  }, {
    name: 'Peak — reel master.mp4',
    icon: 'video',
    tone: 'var(--teal-500)',
    size: '420 MB',
    who: 'Omar Ali',
    when: 'Yesterday',
    v: 'v2'
  }, {
    name: 'Mediva — brand guidelines.pdf',
    icon: 'file-text',
    tone: 'var(--red-500)',
    size: '8.4 MB',
    who: 'Tom Reed',
    when: 'Jun 18',
    v: 'v1'
  }, {
    name: 'Orbit — service agreement.pdf',
    icon: 'file-check',
    tone: 'var(--green-500)',
    size: '320 KB',
    who: 'Lena Cruz',
    when: 'Jun 17',
    v: 'Signed'
  }, {
    name: 'Verde — packaging set.zip',
    icon: 'folder-archive',
    tone: 'var(--amber-500)',
    size: '156 MB',
    who: 'Mia Wu',
    when: 'Jun 15',
    v: 'Final'
  }];
  function Files() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Files"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "810 files \xB7 43.6 GB of 100 GB used")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 16
    }), " Upload")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 20
      }
    }, FOLDERS.map((f, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-lg)',
        background: f.bg,
        color: f.color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: f.icon,
      size: 22
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, f.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, f.count, " files \xB7 ", f.size))))), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Recent files"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, "Team access \xB7 version controlled")), FILES.map((f, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 18px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        height: 34,
        flex: 'none',
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-50)',
        border: '1px solid var(--border-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: f.tone
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: f.icon,
      size: 17
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, f.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, f.who, " \xB7 ", f.when)), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, f.v), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)',
        width: 64,
        textAlign: 'right'
      }
    }, f.size), /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 17,
      style: {
        color: 'var(--text-muted)',
        cursor: 'pointer'
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "more-vertical",
      size: 17,
      style: {
        color: 'var(--text-subtle)',
        cursor: 'pointer'
      }
    })))));
  }
  Object.assign(window, {
    Files
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Files.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Finance.jsx
try { (() => {
// Finance screen — revenue, profit, invoices.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    StatCard
  } = window.TechyFuelOSDesignSystem_be0222;
  const PROFIT = [12, 14, 13, 17, 16, 19, 21, 20, 24, 23, 26, 29];
  const INVOICES = [{
    id: 'INV-2026-0481',
    client: 'Nova Skincare',
    amount: '$12,400',
    status: 'paid',
    due: 'Jun 30'
  }, {
    id: 'INV-2026-0480',
    client: 'Orbit Inc.',
    amount: '$28,900',
    status: 'sent',
    due: 'Jul 2'
  }, {
    id: 'INV-2026-0479',
    client: 'Mediva Health',
    amount: '$18,000',
    status: 'overdue',
    due: 'Jun 12'
  }, {
    id: 'INV-2026-0478',
    client: 'Peak Fitness',
    amount: '$9,200',
    status: 'paid',
    due: 'Jun 8'
  }, {
    id: 'INV-2026-0477',
    client: 'Verde Foods',
    amount: '$22,300',
    status: 'draft',
    due: '—'
  }];
  const IS = {
    paid: ['success', 'Paid'],
    sent: ['info', 'Sent'],
    overdue: ['danger', 'Overdue'],
    draft: ['neutral', 'Draft']
  };
  function Finance() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Finance"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "June 2026 \xB7 5 invoices this cycle")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " New invoice")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Monthly revenue",
      value: "$48,250",
      delta: "12.5%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "trending-up"
      }),
      tone: "success"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Net profit",
      value: "$29,180",
      delta: "8.4%",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "piggy-bank"
      }),
      tone: "brand"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Expenses",
      value: "$19,070",
      delta: "3.0%",
      deltaDirection: "down",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "credit-card"
      }),
      tone: "violet"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Outstanding",
      value: "$46,900",
      delta: "\u2014",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt"
      }),
      tone: "warning"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Net profit"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, "$232K"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--green-600)'
      }
    }, "+18% YTD")), /*#__PURE__*/React.createElement(Bars, {
      data: PROFIT,
      color: "var(--green-500)",
      highlight: "var(--green-600)",
      height: 140
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Invoices"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "download",
      size: 14
    }), " Export")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Invoice', 'Client', 'Amount', 'Status', 'Due'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        textAlign: i === 2 ? 'right' : 'left',
        padding: '10px 18px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, INVOICES.map((inv, i) => {
      const [t, l] = IS[inv.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-body)'
        }
      }, inv.id), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, inv.client), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, inv.amount), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: t,
        dot: true
      }, l)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '11px 18px',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)'
        }
      }, inv.due));
    }))))));
  }
  Object.assign(window, {
    Finance
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Finance.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/MetaAds.jsx
try { (() => {
// Meta Ads Center screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_SPEND = [3.2, 3.6, 4.1, 3.9, 4.8, 5.2, 4.9, 5.6, 6.1, 5.8, 6.4, 7.0];
  const TF_ROAS = [2.8, 3.1, 3.4, 3.2, 3.9, 4.2, 4.6, 4.4, 5.1, 4.9, 5.4, 6.2];
  const TF_CAMPAIGNS = [{
    name: 'Nova — Summer launch',
    client: 'Nova Skincare',
    status: 'active',
    spend: '$4,820',
    roas: '6.2×',
    cpl: '$3.18',
    leads: 412,
    pace: 78
  }, {
    name: 'Peak — Membership drive',
    client: 'Peak Fitness',
    status: 'active',
    spend: '$2,140',
    roas: '4.8×',
    cpl: '$4.02',
    leads: 268,
    pace: 64
  }, {
    name: 'Orbit — Demo signups',
    client: 'Orbit Inc.',
    status: 'active',
    spend: '$6,310',
    roas: '5.4×',
    cpl: '$8.40',
    leads: 188,
    pace: 91
  }, {
    name: 'Lumen — Grand opening',
    client: 'Lumen Cafe',
    status: 'review',
    spend: '$980',
    roas: '3.1×',
    cpl: '$2.74',
    leads: 142,
    pace: 42
  }, {
    name: 'Mediva — Awareness',
    client: 'Mediva Health',
    status: 'paused',
    spend: '$1,560',
    roas: '2.4×',
    cpl: '$6.90',
    leads: 96,
    pace: 30
  }];
  const CAMP_STATUS = {
    active: {
      tone: 'success',
      label: 'Active'
    },
    review: {
      tone: 'warning',
      label: 'In review'
    },
    paused: {
      tone: 'neutral',
      label: 'Paused'
    }
  };
  function AdStat({
    label,
    value,
    delta,
    dir,
    sub,
    color
  }) {
    const pos = dir !== 'down';
    return /*#__PURE__*/React.createElement(Card, {
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        color: color || 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: pos ? 'var(--green-600)' : 'var(--red-600)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: pos ? 'trending-up' : 'trending-down',
      size: 13
    }), " ", delta)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-subtle)'
      }
    }, sub));
  }
  function MetaAds() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "megaphone",
      size: 22,
      style: {
        color: '#fff'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Meta Ads Center"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "5 ad accounts \xB7 12 active campaigns"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 16,
      style: {
        color: 'var(--text-muted)'
      }
    }), " Last 30 days"), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " New campaign"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(AdStat, {
      label: "Ad spend",
      value: "$15.8K",
      delta: "18%",
      sub: "Budget $22K \xB7 72% used"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "ROAS",
      value: "5.4\xD7",
      delta: "0.8\xD7",
      sub: "Target 4.0\xD7 \xB7 exceeding",
      color: "var(--green-600)"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "Cost per lead",
      value: "$4.31",
      delta: "9%",
      dir: "down",
      sub: "Down from $4.74",
      color: "var(--blue-600)"
    }), /*#__PURE__*/React.createElement(AdStat, {
      label: "Leads generated",
      value: "1,106",
      delta: "22%",
      sub: "416 marked qualified"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Ad spend"), /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, "$ thousands")), /*#__PURE__*/React.createElement(Bars, {
      data: TF_SPEND,
      labels: ['', '', 'M', '', '', 'J', '', '', 'A', '', '', 'S'],
      color: "var(--blue-400)",
      highlight: "var(--blue-600)"
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "ROAS trend"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Improving")), /*#__PURE__*/React.createElement(AreaLine, {
      data: TF_ROAS,
      color: "var(--green-600)",
      id: "roas"
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Campaigns by client"), window.TFLinkBtn ? React.createElement(window.TFLinkBtn, null, 'Export report') : null), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Campaign', 'Status', 'Spend', 'ROAS', 'CPL', 'Leads', 'Budget pace'].map((h, i) => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        textAlign: i > 1 && i < 6 ? 'right' : 'left',
        padding: '10px 18px',
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, TF_CAMPAIGNS.map((c, i) => {
      const s = CAMP_STATUS[c.status];
      return /*#__PURE__*/React.createElement("tr", {
        key: i,
        style: {
          borderTop: '1px solid var(--border-subtle)'
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(Avatar, {
        name: c.client,
        size: "sm"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)'
        }
      }, c.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)'
        }
      }, c.client)))), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: s.tone,
        dot: true
      }, s.label)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--text-strong)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.spend), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--green-600)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.roas), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.cpl), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          textAlign: 'right',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-body)',
          fontVariantNumeric: 'tabular-nums'
        }
      }, c.leads), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: '12px 18px',
          width: 130
        }
      }, /*#__PURE__*/React.createElement(ProgressBar, {
        value: c.pace,
        tone: c.pace > 85 ? 'warning' : 'brand',
        size: "sm"
      })));
    })))));
  }
  Object.assign(window, {
    MetaAds
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/MetaAds.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Pipeline.jsx
try { (() => {
// Sales pipeline screen — deal kanban.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const STAGES = [{
    id: 'new',
    label: 'New lead',
    dot: 'var(--slate-400)',
    deals: [{
      co: 'Bright Studio',
      val: '$8K',
      who: 'Tom Reed',
      tag: 'Inbound'
    }, {
      co: 'Kite Apparel',
      val: '$5K',
      who: 'Tom Reed',
      tag: 'Instagram'
    }]
  }, {
    id: 'contacted',
    label: 'Contacted',
    dot: 'var(--blue-500)',
    deals: [{
      co: 'Mediva Health',
      val: '$18K',
      who: 'Sara Khan',
      tag: 'LinkedIn'
    }]
  }, {
    id: 'discovery',
    label: 'Discovery call',
    dot: 'var(--sky-500)',
    deals: [{
      co: 'Atlas Realty',
      val: '$15K',
      who: 'Tom Reed',
      tag: 'Referral'
    }, {
      co: 'Lumen Cafe',
      val: '$6.5K',
      who: 'Lena Cruz',
      tag: 'Cold'
    }]
  }, {
    id: 'proposal',
    label: 'Proposal sent',
    dot: 'var(--violet-500)',
    deals: [{
      co: 'Orbit Inc.',
      val: '$28.9K',
      who: 'Sara Khan',
      tag: 'Inbound',
      hot: true
    }]
  }, {
    id: 'negotiation',
    label: 'Negotiation',
    dot: 'var(--amber-500)',
    deals: [{
      co: 'Verde Foods',
      val: '$22.3K',
      who: 'Tom Reed',
      tag: 'Referral',
      hot: true
    }]
  }, {
    id: 'won',
    label: 'Won',
    dot: 'var(--green-500)',
    deals: [{
      co: 'Nova Skincare',
      val: '$12.4K',
      who: 'Sara Khan',
      tag: 'Referral'
    }]
  }];
  function Deal({
    d
  }) {
    const [h, sh] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => sh(true),
      onMouseLeave: () => sh(false),
      style: {
        background: 'var(--slate-0)',
        border: `1px solid ${h ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 11,
        boxShadow: h ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'grab',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, d.co), d.hot && /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-extrabold)',
        color: 'var(--blue-600)',
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        marginBottom: 9
      }
    }, d.val), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      size: "sm"
    }, d.tag), /*#__PURE__*/React.createElement(Avatar, {
      name: d.who,
      size: "xs"
    })));
  }
  function Pipeline() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Sales pipeline"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "8 open deals \xB7 $119.6K weighted value")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " Add deal")), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start'
      }
    }, STAGES.map(s => {
      const total = s.deals.reduce((a, d) => a + parseFloat(d.val.replace(/[$K]/g, '')), 0);
      return /*#__PURE__*/React.createElement("div", {
        key: s.id,
        style: {
          width: 230,
          flex: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '2px 4px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: s.dot
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-strong)'
        }
      }, s.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--fw-bold)',
          color: 'var(--text-muted)',
          marginLeft: 'auto',
          fontVariantNumeric: 'tabular-nums'
        }
      }, "$", total, "K")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--slate-100)',
          borderRadius: 'var(--radius-xl)',
          padding: 10,
          minHeight: 100
        }
      }, s.deals.map((d, i) => /*#__PURE__*/React.createElement(Deal, {
        key: i,
        d: d
      }))));
    })));
  }
  Object.assign(window, {
    Pipeline
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Pipeline.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Projects.jsx
try { (() => {
// Projects screen — project cards grid.
(() => {
  const {
    Card,
    Badge,
    AvatarGroup,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const PT = {
    Design: 'violet',
    Video: 'teal',
    'Social Media': 'success',
    'Meta Ads': 'brand',
    'Web Dev': 'info',
    SEO: 'warning'
  };
  const PS = {
    planning: ['neutral', 'Planning'],
    progress: ['info', 'In progress'],
    review: ['warning', 'Review'],
    approval: ['violet', 'Client approval'],
    done: ['success', 'Completed']
  };
  const PROJECTS = [{
    name: 'Summer launch campaign',
    client: 'Nova Skincare',
    type: 'Meta Ads',
    status: 'progress',
    pct: 78,
    budget: '$12.4K',
    spent: 72,
    team: ['Sara Khan', 'Omar Ali', 'Lena Cruz'],
    due: 'Jun 28'
  }, {
    name: 'Web build — phase 2',
    client: 'Orbit Inc.',
    type: 'Web Dev',
    status: 'progress',
    pct: 64,
    budget: '$28.9K',
    spent: 58,
    team: ['Jay Park', 'Mia Wu'],
    due: 'Jul 4'
  }, {
    name: 'Brand kit & guidelines',
    client: 'Mediva Health',
    type: 'Design',
    status: 'approval',
    pct: 90,
    budget: '$18.0K',
    spent: 81,
    team: ['Sara Khan', 'Tom Reed'],
    due: 'Jun 27'
  }, {
    name: 'Monthly content — June',
    client: 'Peak Fitness',
    type: 'Social Media',
    status: 'review',
    pct: 45,
    budget: '$9.2K',
    spent: 40,
    team: ['Omar Ali', 'Lena Cruz'],
    due: 'Jun 24'
  }, {
    name: 'SEO foundation audit',
    client: 'Atlas Realty',
    type: 'SEO',
    status: 'planning',
    pct: 12,
    budget: '$6.0K',
    spent: 8,
    team: ['Jay Park'],
    due: 'Jul 10'
  }, {
    name: 'Product demo series',
    client: 'Verde Foods',
    type: 'Video',
    status: 'done',
    pct: 100,
    budget: '$22.3K',
    spent: 96,
    team: ['Omar Ali', 'Mia Wu', 'Tom Reed'],
    due: 'Jun 18'
  }];
  function ProjectCard({
    p
  }) {
    const [st, sl] = PS[p.status];
    return /*#__PURE__*/React.createElement(Card, {
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        letterSpacing: '-0.01em'
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, p.client)), /*#__PURE__*/React.createElement(Icon, {
      name: "more-horizontal",
      size: 18,
      style: {
        color: 'var(--text-subtle)',
        cursor: 'pointer',
        flex: 'none'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: PT[p.type],
      size: "sm"
    }, p.type), /*#__PURE__*/React.createElement(Badge, {
      tone: st,
      dot: true
    }, sl)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "Progress"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-strong)',
        fontWeight: 'var(--fw-bold)'
      }
    }, p.pct, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: p.pct,
      tone: p.status === 'done' ? 'success' : 'brand',
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-2xs)',
        color: 'var(--text-subtle)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        fontWeight: 'var(--fw-bold)'
      }
    }, "Budget \xB7 ", p.spent, "% used"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.budget)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(AvatarGroup, {
      people: p.team,
      size: "xs",
      max: 3
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), " ", p.due))));
  }
  function Projects() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Projects"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "27 active \xB7 $96.8K in committed budget")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " New project")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, PROJECTS.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, {
      key: i,
      p: p
    }))));
  }
  Object.assign(window, {
    Projects
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Projects.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Reports.jsx
try { (() => {
// Reports center screen.
(() => {
  const {
    Card,
    Badge,
    Avatar
  } = window.TechyFuelOSDesignSystem_be0222;
  const REPORTS = [{
    name: 'Client performance report',
    desc: 'Per-client retainer, deliverables & satisfaction',
    icon: 'users',
    tone: ['var(--blue-50)', 'var(--blue-600)'],
    runs: 'Auto · monthly'
  }, {
    name: 'Team productivity report',
    desc: 'Utilization, output and on-time delivery by member',
    icon: 'gauge',
    tone: ['var(--violet-50)', 'var(--violet-600)'],
    runs: 'Auto · weekly'
  }, {
    name: 'Revenue & profit report',
    desc: 'MRR, net profit, expenses and forecast',
    icon: 'trending-up',
    tone: ['var(--green-50)', 'var(--green-600)'],
    runs: 'Auto · monthly'
  }, {
    name: 'Ads performance report',
    desc: 'Spend, ROAS, CPL and leads across ad accounts',
    icon: 'megaphone',
    tone: ['var(--amber-50)', 'var(--amber-600)'],
    runs: 'Manual'
  }, {
    name: 'Project status report',
    desc: 'Milestones, budget burn and risk flags',
    icon: 'folder-kanban',
    tone: ['var(--teal-50)', 'var(--teal-600)'],
    runs: 'Auto · weekly'
  }, {
    name: 'Content engagement report',
    desc: 'Reach, engagement and best-performing posts',
    icon: 'heart',
    tone: ['var(--red-50)', 'var(--red-600)'],
    runs: 'Manual'
  }];
  function Reports() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Reporting center"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "6 report templates \xB7 export to PDF or Excel")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " Build report")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, REPORTS.map((r, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      padding: "md",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-lg)',
        background: r.tone[0],
        color: r.tone[1],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: r.icon,
      size: 21
    })), /*#__PURE__*/React.createElement(Badge, {
      tone: r.runs === 'Manual' ? 'neutral' : 'success',
      size: "sm"
    }, r.runs)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 4,
        lineHeight: 1.45
      }
    }, r.desc)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "file-text",
      size: 14,
      style: {
        color: 'var(--red-500)'
      }
    }), " PDF"), /*#__PURE__*/React.createElement("button", {
      style: {
        flex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sheet",
      size: 14,
      style: {
        color: 'var(--green-600)'
      }
    }), " Excel"))))));
  }
  Object.assign(window, {
    Reports
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Reports.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Settings.jsx
try { (() => {
// Settings screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    Switch,
    Input
  } = window.TechyFuelOSDesignSystem_be0222;
  const NAV = [['building-2', 'Agency branding', true], ['shield-check', 'Team permissions', false], ['bell', 'Email notifications', false], ['plug', 'Integrations', false], ['key-round', 'API access', false]];
  const INTEGRATIONS = [{
    name: 'Meta Business',
    icon: 'facebook',
    tone: 'var(--blue-600)',
    on: true
  }, {
    name: 'Google Ads',
    icon: 'badge-dollar-sign',
    tone: 'var(--green-600)',
    on: true
  }, {
    name: 'Slack',
    icon: 'slack',
    tone: 'var(--violet-500)',
    on: true
  }, {
    name: 'Stripe',
    icon: 'credit-card',
    tone: 'var(--blue-500)',
    on: false
  }];
  function Row({
    title,
    desc,
    control
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, desc)), control);
  }
  function Settings() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1100,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em',
        marginBottom: 18
      }
    }, "Settings"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "sm",
      style: {
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, NAV.map(([ic, l, act], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 'var(--radius-md)',
        background: act ? 'var(--blue-50)' : 'transparent',
        color: act ? 'var(--blue-700)' : 'var(--text-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17,
      style: {
        color: act ? 'var(--blue-600)' : 'var(--text-muted)'
      }
    }), l)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Agency branding"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginBottom: 16
      }
    }, "This appears across the client portal and reports."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-xl)',
        background: 'var(--grad-brand)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-brand)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/techyfuel-mark.png",
      alt: "",
      style: {
        height: 32,
        filter: 'brightness(0) invert(1)'
      }
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 34,
        padding: '0 13px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "upload",
      size: 15
    }), " Upload logo")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Agency name",
      defaultValue: "Bright Pixel Co."
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Support email",
      defaultValue: "hello@brightpixel.co",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "mail",
        size: 16
      })
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 4
      }
    }, "Email notifications"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement(Row, {
      title: "New client approvals",
      desc: "When a client approves or requests a revision",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "Deadline reminders",
      desc: "Daily digest of tasks due within 48 hours",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "AI risk alerts",
      desc: "When the assistant detects a deadline or budget risk",
      control: /*#__PURE__*/React.createElement(Switch, {
        defaultChecked: true
      })
    }), /*#__PURE__*/React.createElement(Row, {
      title: "Weekly summary",
      desc: "Monday recap of revenue, tasks and pipeline",
      control: /*#__PURE__*/React.createElement(Switch, null)
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "lg"
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 'var(--text-lg)',
        fontWeight: 'var(--fw-bold)',
        marginBottom: 16
      }
    }, "Integrations"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, INTEGRATIONS.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--slate-50)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-subtle)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: it.tone
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: it.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)'
      }
    }, it.name), it.on ? /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "Connected") : /*#__PURE__*/React.createElement("button", {
      style: {
        height: 28,
        padding: '0 12px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, "Connect"))))))));
  }
  Object.assign(window, {
    Settings
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/TasksBoard.jsx
try { (() => {
// Tasks — Kanban board screen.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    AvatarGroup,
    Tabs
  } = window.TechyFuelOSDesignSystem_be0222;
  const TF_PRIORITY = {
    urgent: {
      color: 'var(--red-600)',
      bg: 'var(--red-50)',
      label: 'Urgent',
      icon: 'chevrons-up'
    },
    high: {
      color: 'var(--amber-600)',
      bg: 'var(--amber-50)',
      label: 'High',
      icon: 'chevron-up'
    },
    medium: {
      color: 'var(--blue-600)',
      bg: 'var(--blue-50)',
      label: 'Medium',
      icon: 'equal'
    },
    low: {
      color: 'var(--slate-500)',
      bg: 'var(--slate-100)',
      label: 'Low',
      icon: 'chevron-down'
    }
  };
  const TYPE_TONE = {
    Design: 'violet',
    Video: 'teal',
    Ads: 'brand',
    Web: 'info',
    SEO: 'warning',
    Social: 'success'
  };
  const TF_COLUMNS = [{
    id: 'backlog',
    label: 'Backlog',
    dot: 'var(--slate-400)',
    tasks: [{
      t: 'Q3 content strategy deck',
      type: 'Social',
      pri: 'low',
      who: 'Lena Cruz',
      due: 'Jul 2',
      sub: '0/4'
    }, {
      t: 'Competitor SEO audit — Orbit',
      type: 'SEO',
      pri: 'medium',
      who: 'Jay Park',
      due: 'Jul 5',
      sub: '1/6'
    }]
  }, {
    id: 'todo',
    label: 'To do',
    dot: 'var(--blue-500)',
    tasks: [{
      t: 'Reels batch — Peak Fitness',
      type: 'Video',
      pri: 'high',
      who: 'Omar Ali',
      due: 'Jun 24',
      sub: '2/8',
      cmt: 3
    }, {
      t: 'Landing page wireframes',
      type: 'Web',
      pri: 'medium',
      who: 'Mia Wu',
      due: 'Jun 25',
      sub: '0/5'
    }, {
      t: 'Meta ad creatives v3',
      type: 'Ads',
      pri: 'urgent',
      who: 'Sara Khan',
      due: 'Today',
      sub: '3/5',
      cmt: 6
    }]
  }, {
    id: 'progress',
    label: 'In progress',
    dot: 'var(--violet-500)',
    tasks: [{
      t: 'Homepage hero design',
      type: 'Design',
      pri: 'high',
      who: 'Sara Khan',
      due: 'Jun 23',
      sub: '4/6',
      cmt: 2,
      team: ['Sara Khan', 'Mia Wu']
    }, {
      t: 'Brand kit — Mediva',
      type: 'Design',
      pri: 'medium',
      who: 'Tom Reed',
      due: 'Jun 27',
      sub: '2/7'
    }]
  }, {
    id: 'review',
    label: 'Review',
    dot: 'var(--amber-500)',
    tasks: [{
      t: 'Launch campaign captions',
      type: 'Social',
      pri: 'urgent',
      who: 'Lena Cruz',
      due: 'Today',
      sub: '5/5',
      cmt: 1,
      flag: true
    }, {
      t: 'Product demo edit',
      type: 'Video',
      pri: 'high',
      who: 'Omar Ali',
      due: 'Jun 23',
      sub: '6/6'
    }]
  }, {
    id: 'done',
    label: 'Completed',
    dot: 'var(--green-500)',
    tasks: [{
      t: 'Logo refresh — Nova',
      type: 'Design',
      pri: 'medium',
      who: 'Sara Khan',
      due: 'Jun 18',
      sub: '6/6',
      done: true
    }, {
      t: 'June ad report',
      type: 'Ads',
      pri: 'low',
      who: 'Jay Park',
      due: 'Jun 17',
      sub: '3/3',
      done: true
    }]
  }];
  function TaskCard({
    task
  }) {
    const [hover, setHover] = React.useState(false);
    const p = TF_PRIORITY[task.pri];
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        background: 'var(--slate-0)',
        border: `1px solid ${hover ? 'var(--slate-200)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 12,
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        cursor: 'grab',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: TYPE_TONE[task.type],
      size: "sm"
    }, task.type), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 'var(--text-2xs)',
        fontWeight: 'var(--fw-bold)',
        color: p.color,
        background: p.bg,
        borderRadius: 'var(--radius-full)',
        padding: '2px 7px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: p.icon,
      size: 12
    }), " ", p.label), task.flag && /*#__PURE__*/React.createElement(Icon, {
      name: "flag",
      size: 13,
      style: {
        color: 'var(--red-500)',
        marginLeft: 'auto'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-strong)',
        lineHeight: 1.4,
        marginBottom: 10,
        textDecoration: task.done ? 'line-through' : 'none',
        opacity: task.done ? 0.6 : 1
      }
    }, task.t), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--text-muted)',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check-square",
      size: 13
    }), " ", task.sub), task.cmt && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-square",
      size: 13
    }), " ", task.cmt), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: task.due === 'Today' ? 'var(--red-600)' : 'var(--text-muted)',
        fontWeight: task.due === 'Today' ? 'var(--fw-bold)' : 'var(--fw-medium)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 13
    }), " ", task.due), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto'
      }
    }, task.team ? /*#__PURE__*/React.createElement(AvatarGroup, {
      people: task.team,
      size: "xs",
      max: 2
    }) : /*#__PURE__*/React.createElement(Avatar, {
      name: task.who,
      size: "xs"
    }))));
  }
  function TasksBoard() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 14,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Tasks"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "All projects \xB7 24 open tasks")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16
    }), " Add task")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      defaultValue: "kanban",
      tabs: [{
        id: 'list',
        label: 'List',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "list",
          size: 16
        })
      }, {
        id: 'kanban',
        label: 'Board',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "columns-3",
          size: 16
        }),
        count: 24
      }, {
        id: 'calendar',
        label: 'Calendar',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "calendar",
          size: 16
        })
      }]
    })), /*#__PURE__*/React.createElement("div", {
      className: "tf-scroll",
      style: {
        flex: 1,
        display: 'flex',
        gap: 14,
        overflowX: 'auto',
        paddingBottom: 8,
        alignItems: 'flex-start'
      }
    }, TF_COLUMNS.map(col => /*#__PURE__*/React.createElement("div", {
      key: col.id,
      style: {
        width: 268,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '2px 4px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: col.dot
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, col.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-muted)',
        background: 'var(--slate-150)',
        borderRadius: 'var(--radius-full)',
        padding: '0px 7px',
        fontVariantNumeric: 'tabular-nums'
      }
    }, col.tasks.length), /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 15,
      style: {
        color: 'var(--text-subtle)',
        marginLeft: 'auto',
        cursor: 'pointer'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'var(--slate-100)',
        borderRadius: 'var(--radius-xl)',
        padding: 10,
        minHeight: 120
      }
    }, col.tasks.map((t, i) => /*#__PURE__*/React.createElement(TaskCard, {
      key: i,
      task: t
    })), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 0',
        background: 'transparent',
        border: '1px dashed var(--border-strong)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 14
    }), " Add task"))))));
  }
  Object.assign(window, {
    TasksBoard
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/TasksBoard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/Team.jsx
try { (() => {
// Team screen — members by department + workload.
(() => {
  const {
    Card,
    Badge,
    Avatar,
    ProgressBar
  } = window.TechyFuelOSDesignSystem_be0222;
  const DEPT = {
    Design: 'violet',
    Video: 'teal',
    Marketing: 'success',
    Development: 'info',
    Sales: 'warning',
    Admin: 'neutral'
  };
  const TEAM = [{
    name: 'Sara Khan',
    role: 'Creative Lead',
    dept: 'Design',
    load: 88,
    tasks: 12,
    status: 'online'
  }, {
    name: 'Omar Ali',
    role: 'Senior Editor',
    dept: 'Video',
    load: 72,
    tasks: 9,
    status: 'online'
  }, {
    name: 'Lena Cruz',
    role: 'Social Manager',
    dept: 'Marketing',
    load: 64,
    tasks: 14,
    status: 'busy'
  }, {
    name: 'Jay Park',
    role: 'Full-stack Dev',
    dept: 'Development',
    load: 91,
    tasks: 7,
    status: 'busy'
  }, {
    name: 'Mia Wu',
    role: 'UI Designer',
    dept: 'Design',
    load: 55,
    tasks: 8,
    status: 'away'
  }, {
    name: 'Tom Reed',
    role: 'Account Exec',
    dept: 'Sales',
    load: 43,
    tasks: 6,
    status: 'online'
  }];
  function Team() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        maxWidth: 1280,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 18,
        flexWrap: 'wrap',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--text-3xl)',
        fontWeight: 'var(--fw-extrabold)',
        letterSpacing: '-0.02em'
      }
    }, "Team"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, "14 members \xB7 6 departments \xB7 69% avg utilization")), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        height: 36,
        padding: '0 14px',
        background: 'var(--blue-600)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-brand)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-plus",
      size: 16
    }), " Invite member")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 18
      }
    }, Object.keys(DEPT).map(d => /*#__PURE__*/React.createElement("span", {
      key: d,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 12px',
        background: 'var(--slate-0)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: `var(--${DEPT[d] === 'neutral' ? 'slate-400' : DEPT[d] === 'info' ? 'blue-500' : DEPT[d] + '-500'})`
      }
    }), d))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16
      }
    }, TEAM.map((m, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      size: "lg",
      status: m.status
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--fw-bold)',
        color: 'var(--text-strong)'
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, m.role)), /*#__PURE__*/React.createElement(Badge, {
      tone: DEPT[m.dept],
      size: "sm"
    }, m.dept)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 'var(--text-xs)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 'var(--fw-semibold)'
      }
    }, "Workload"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: m.load > 85 ? 'var(--red-600)' : 'var(--text-strong)',
        fontWeight: 'var(--fw-bold)'
      }
    }, m.load, "%")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: m.load,
      tone: m.load > 85 ? 'danger' : m.load > 70 ? 'warning' : 'brand',
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        paddingTop: 12,
        borderTop: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check-big",
      size: 14
    }), " ", m.tasks, " active tasks"))))));
  }
  Object.assign(window, {
    Team
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/Team.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/charts.jsx
try { (() => {
// Lightweight inline SVG charts for the TechyFuel OS kit (data viz, not icons).

function AreaLine({
  data,
  width = 520,
  height = 160,
  color = 'var(--blue-600)',
  fill = 'rgba(37,99,235,0.10)',
  id = 'al'
}) {
  const max = Math.max(...data) * 1.15,
    min = Math.min(...data) * 0.85;
  const pad = 6;
  const x = i => pad + i * (width - pad * 2) / (data.length - 1);
  const y = v => height - pad - (v - min) / (max - min) * (height - pad * 2);
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1)} ${height - pad} L${x(0)} ${height - pad} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.18"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75, 1].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: "0",
    x2: width,
    y1: height * g,
    y2: height * g,
    stroke: "var(--slate-150)",
    strokeWidth: "1"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#${id})`
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), pts.map((p, i) => i === pts.length - 1 ? /*#__PURE__*/React.createElement("circle", {
    key: i,
    cx: p[0],
    cy: p[1],
    r: "4",
    fill: color,
    stroke: "#fff",
    strokeWidth: "2"
  }) : null));
}
function Bars({
  data,
  labels,
  width = 520,
  height = 160,
  color = 'var(--blue-500)',
  highlight = 'var(--blue-600)'
}) {
  const max = Math.max(...data) * 1.1,
    pad = 6,
    gap = 10;
  const bw = (width - pad * 2 - gap * (data.length - 1)) / data.length;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    style: {
      display: 'block'
    }
  }, [0.33, 0.66, 1].map(g => /*#__PURE__*/React.createElement("line", {
    key: g,
    x1: "0",
    x2: width,
    y1: height - 20 - (height - 30) * g,
    y2: height - 20 - (height - 30) * g,
    stroke: "var(--slate-150)"
  })), data.map((v, i) => {
    const h = v / max * (height - 30);
    const x = pad + i * (bw + gap);
    const last = i === data.length - 1;
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("rect", {
      x: x,
      y: height - 20 - h,
      width: bw,
      height: h,
      rx: "4",
      fill: last ? highlight : color,
      opacity: last ? 1 : 0.5
    }), labels && /*#__PURE__*/React.createElement("text", {
      x: x + bw / 2,
      y: height - 5,
      textAnchor: "middle",
      fontSize: "10",
      fill: "var(--text-subtle)",
      fontFamily: "var(--font-sans)"
    }, labels[i]));
  }));
}
function Donut({
  segments,
  size = 150,
  thickness = 22
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2,
    c = 2 * Math.PI * r;
  let offset = 0;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--slate-100)",
    strokeWidth: thickness
  }), segments.map((s, i) => {
    const len = s.value / total * c;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: size / 2,
      cy: size / 2,
      r: r,
      fill: "none",
      stroke: s.color,
      strokeWidth: thickness,
      strokeDasharray: `${len} ${c - len}`,
      strokeDashoffset: -offset,
      strokeLinecap: "round",
      transform: `rotate(-90 ${size / 2} ${size / 2})`
    });
    offset += len;
    return el;
  }), /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 - 4,
    textAnchor: "middle",
    fontSize: "26",
    fontWeight: "800",
    fill: "var(--text-strong)",
    fontFamily: "var(--font-display)"
  }, total), /*#__PURE__*/React.createElement("text", {
    x: size / 2,
    y: size / 2 + 16,
    textAnchor: "middle",
    fontSize: "11",
    fill: "var(--text-muted)",
    fontFamily: "var(--font-sans)"
  }, "projects"));
}
function Spark({
  data,
  width = 100,
  height = 32,
  color = 'var(--green-500)'
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const x = i => i * width / (data.length - 1);
  const y = v => height - (v - min) / (max - min || 1) * height;
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${width} ${height}`,
    width: "100%",
    height: height,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(window, {
  AreaLine,
  Bars,
  Donut,
  Spark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/techyfuel-os/helpers.jsx
try { (() => {
// Shared helpers for the TechyFuel OS UI kit.
// Lucide icon as a React element (replaced into <svg> by lucide.createIcons()).
function Icon({
  name,
  size = 18,
  style,
  strokeWidth = 1.75
}) {
  return React.createElement('i', {
    'data-lucide': name,
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      strokeWidth,
      ...style
    }
  });
}

// Call after renders to hydrate any new <i data-lucide> placeholders.
function useLucide() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}
Object.assign(window, {
  Icon,
  useLucide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/techyfuel-os/helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarGroup = __ds_scope.AvatarGroup;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
