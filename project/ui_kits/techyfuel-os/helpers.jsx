// Shared helpers for the TechyFuel OS UI kit.
// Lucide icon as a React element (replaced into <svg> by lucide.createIcons()).
function Icon({ name, size = 18, style, strokeWidth = 1.75 }) {
  return React.createElement('i', {
    'data-lucide': name,
    style: { width: size, height: size, display: 'inline-flex', strokeWidth, ...style },
  });
}

// Call after renders to hydrate any new <i data-lucide> placeholders.
function useLucide() {
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });
}

Object.assign(window, { Icon, useLucide });
