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
function Icon({ name, size = 18, style, strokeWidth = 1.75 }) {
  const nodes = window.lucide && window.lucide.icons && window.lucide.icons[tfIconPascalName(name)];
  if (!nodes) {
    return React.createElement('span', { style: { width: size, height: size, display: 'inline-flex', flexShrink: 0, ...style } });
  }
  return React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { display: 'inline-flex', flexShrink: 0, ...style },
  }, nodes.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs })));
}

// Kept as a harmless no-op for any lingering callers — Icon no longer
// depends on lucide.createIcons() to render.
function useLucide() {}

// ── Generic overlay modal ─────────────────────────────────────
function Modal({ open, onClose, title, children, onSubmit, loading, submitLabel }) {
  if (!open) return null;
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--slate-0)', borderRadius: 'var(--radius-2xl)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', width: '100%', maxWidth: 480, maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', flex: '0 0 auto' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--text-strong)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 4, borderRadius: 'var(--radius-sm)', display: 'flex', lineHeight: 1 }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>{children}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flex: '0 0 auto',
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

// ── Google Drive picker (OAuth via Google Identity Services + Picker API) ──
// Shared by any screen that wants to attach real Drive files (Docs & Files,
// the legacy Files screen, etc). Needs a Client ID + API key configured on
// the Integrations screen first — nothing loads or runs until a screen
// actually calls pickFilesFromGoogleDrive().
function readIntegrationsCfg() {
  try { return JSON.parse(localStorage.getItem('tf_integrations') || '{}'); } catch { return {}; }
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

// Cached in memory only (never persisted to disk) — survives client-side
// navigation within the same tab so the OAuth popup only shows once per
// session instead of on every single "Google Drive" click, but disappears
// on a full page reload / new tab.
let _driveTokenCache = null; // { accessToken, expiresAt, clientId }

function openDrivePicker(accessToken, apiKey) {
  return new Promise((resolve, reject) => {
    try {
      const view = new window.google.picker.DocsView().setIncludeFolders(true).setSelectFolderEnabled(false);
      const picker = new window.google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(accessToken)
        .setDeveloperKey(apiKey)
        .setCallback(data => {
          if (data.action === window.google.picker.Action.PICKED) resolve(data.docs || []);
          else if (data.action === window.google.picker.Action.CANCEL) resolve([]);
        })
        .build();
      picker.setVisible(true);
    } catch (err) { reject(err); }
  });
}

async function pickFilesFromGoogleDrive({ clientId, apiKey }) {
  await Promise.all([
    loadScriptOnce('https://accounts.google.com/gsi/client'),
    loadScriptOnce('https://apis.google.com/js/api.js'),
  ]);
  await new Promise((resolve, reject) => window.gapi.load('picker', { callback: resolve, onerror: reject }));

  const cached = _driveTokenCache;
  if (cached && cached.clientId === clientId && cached.expiresAt > Date.now() + 60000) {
    return openDrivePicker(cached.accessToken, apiKey);
  }

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      // drive.file: only files the user opens/creates through this app —
      // no request for blanket access to their whole Drive.
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: async (resp) => {
        if (resp.error) { reject(new Error(resp.error_description || resp.error)); return; }
        _driveTokenCache = { accessToken: resp.access_token, expiresAt: Date.now() + Number(resp.expires_in || 3600) * 1000, clientId };
        try { resolve(await openDrivePicker(resp.access_token, apiKey)); } catch (err) { reject(err); }
      },
    });
    tokenClient.requestAccessToken();
  });
}

// A file counts as "Drive-origin" if it's a native Google format (Doc/Sheet/
// Slide) or its link points at drive.google.com — covers regular files
// (photos, PDFs, etc) picked from Drive too, since the Picker always hands
// back a drive.google.com viewer link for those rather than raw file bytes.
// Those links only work as a normal browser navigation, not as the src of
// an <img>/<video>/<iframe>, so screens must not try to embed them directly.
function isDriveFile(f) {
  const mime = f.mime_type || f.file_type || '';
  const link = f.file_path || f.url || '';
  return mime.startsWith('application/vnd.google-apps') || /drive\.google\.com/.test(link);
}

// ── Email unread count (sidebar badge + notification bell) ────────────────
async function getEmailAuthHeader() {
  const token = localStorage.getItem('tf_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Sums unread across the shared default inbox (if configured) and every
// email account this member has connected -- so the sidebar/bell badge
// reflects all of a person's mail, not just whichever one happens to be
// active in the Email screen right now.
async function getTotalUnreadEmailCount() { return 0; /* email badge disabled on Laravel backend */
  if (!window.db) return 0;
  const headers = await getEmailAuthHeader();
  try {
    const [defaultRes, accountsRes] = await Promise.all([
      fetch('/api/email-unread-count', { headers }).then(r => r.json()).catch(() => ({ unread: 0 })),
      fetch('/api/email-accounts', { headers }).then(r => r.json()).catch(() => ({ accounts: [] })),
    ]);
    let total = defaultRes.unread || 0;
    const accounts = (accountsRes.ok && accountsRes.accounts) || [];
    const perAccount = await Promise.all(accounts.map(a =>
      fetch(`/api/email-unread-count?accountId=${a.id}`, { headers }).then(r => r.json()).catch(() => ({ unread: 0 }))
    ));
    perAccount.forEach(r => { total += r.unread || 0; });
    return total;
  } catch { return 0; }
}

Object.assign(window, { Icon, useLucide, Modal, FormRow, FF, readIntegrationsCfg, pickFilesFromGoogleDrive, isDriveFile, getTotalUnreadEmailCount });
