// Auth screen — sign in / sign up / forgot password
(() => {

function AuthScreen({ onAuth }) {
  useLucide();
  const [mode, setMode] = React.useState('signin');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const switchMode = (m) => { setMode(m); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (mode === 'signup') {
      if (!name.trim()) return setError('Full name is required');
      if (password !== confirm) return setError('Passwords do not match');
      if (password.length < 6) return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { data, error: err } = await window.db.auth.signInWithPassword({ email, password });
        if (err) return setError(err.message);
        onAuth(data.user);
      } else {
        const { data, error: err } = await window.db.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        });
        if (err) return setError(err.message);
        if (data.user && !data.session) {
          setSuccess('Check your email to confirm your account, then sign in.');
          switchMode('signin');
        } else if (data.user) {
          onAuth(data.user);
        }
      }
    } catch (ex) {
      setError(ex.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return setError('Enter your email address first');
    setLoading(true); setError('');
    try {
      const { error: err } = await window.db.auth.resetPasswordForEmail(email);
      if (err) setError(err.message);
      else setSuccess('Password reset link sent — check your inbox.');
    } catch { setError('Failed to send reset email'); }
    finally { setLoading(false); }
  };

  const inp = (extra = {}) => ({
    style: {
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid var(--border-default)', fontSize: 14,
      fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
      background: 'white', color: 'var(--text-strong)', transition: 'border-color 0.15s',
      ...extra,
    },
    onFocus: e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; },
    onBlur:  e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; },
  });

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── Left branding ── */}
      <div style={{
        width: '44%', flexShrink: 0,
        background: 'linear-gradient(145deg,#0c1320 0%,#0f2044 45%,#1a3a6e 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-100, right:-100, width:380, height:380, borderRadius:'50%', background:'rgba(59,130,246,0.06)' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(99,102,241,0.07)' }} />
        <div style={{ position:'absolute', top:'38%', left:'8%', width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />

        <div style={{ position:'relative', width:'100%', maxWidth:340 }}>
          {/* Logo mark */}
          <div style={{ width:64, height:64, borderRadius:18, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)',
            display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28, backdropFilter:'blur(10px)' }}>
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L33 12V24L18 33L3 24V12L18 3Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <path d="M18 8L28 14V26L18 32L8 26V14L18 8Z" fill="rgba(59,130,246,0.25)"/>
              <circle cx="18" cy="18" r="5.5" fill="white"/>
            </svg>
          </div>

          <h1 style={{ fontSize:30, fontWeight:800, color:'white', letterSpacing:'-0.03em', margin:'0 0 10px', lineHeight:1.1 }}>TechyFuel OS</h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', margin:'0 0 44px', lineHeight:1.6 }}>
            Your complete agency operating system.<br/>Built for modern digital teams.
          </p>

          {[
            ['layout-dashboard', 'Executive dashboard & live analytics'],
            ['contact', 'CRM, pipeline & client portal'],
            ['message-square', 'Team chat, calls & collaboration'],
            ['zap', 'Automations, AI assistant & more'],
          ].map(([icon, text]) => (
            <div key={icon} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <span style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.08)',
                border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={icon} size={15} style={{ color:'rgba(255,255,255,0.75)' }} />
              </span>
              <span style={{ fontSize:13.5, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9', padding:'40px 32px' }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Mode tabs */}
          <div style={{ display:'flex', background:'white', borderRadius:12, padding:4,
            border:'1px solid var(--border-default)', marginBottom:30, boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            {[['signin','Sign in'],['signup','Create account']].map(([m,label]) => (
              <button key={m} onClick={() => switchMode(m)}
                style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer',
                  fontFamily:'var(--font-sans)', fontWeight:600, fontSize:13.5, transition:'all 0.15s',
                  background: mode===m ? '#2563eb' : 'transparent',
                  color: mode===m ? 'white' : 'var(--text-muted)' }}>
                {label}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize:22, fontWeight:800, letterSpacing:'-0.025em', margin:'0 0 4px', color:'var(--text-heading)' }}>
            {mode === 'signin' ? 'Welcome back' : 'Get started free'}
          </h2>
          <p style={{ fontSize:13.5, color:'var(--text-muted)', margin:'0 0 24px' }}>
            {mode === 'signin' ? 'Sign in to your TechyFuel OS account' : 'Create your account — no credit card needed'}
          </p>

          {/* Alerts */}
          {error && (
            <div style={{ background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:10, padding:'11px 14px',
              marginBottom:18, fontSize:13.5, color:'#be123c', display:'flex', gap:8, alignItems:'flex-start' }}>
              <Icon name="circle-alert" size={15} style={{ flexShrink:0, marginTop:1 }} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'11px 14px',
              marginBottom:18, fontSize:13.5, color:'#15803d', display:'flex', gap:8, alignItems:'flex-start' }}>
              <Icon name="circle-check" size={15} style={{ flexShrink:0, marginTop:1 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:'var(--text-body)', display:'block', marginBottom:6 }}>Full name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Alex Johnson" required
                  {...inp()} />
              </div>
            )}

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12.5, fontWeight:600, color:'var(--text-body)', display:'block', marginBottom:6 }}>Email address</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@agency.com" required
                {...inp()} />
            </div>

            <div style={{ marginBottom: mode==='signup' ? 14 : 6 }}>
              <label style={{ fontSize:12.5, fontWeight:600, color:'var(--text-body)', display:'block', marginBottom:6 }}>Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  {...inp({ paddingRight:42 })} />
                <button type="button" onClick={()=>setShowPass(!showPass)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:0, lineHeight:1 }}>
                  <Icon name={showPass?'eye-off':'eye'} size={15} />
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom:6 }}>
                <label style={{ fontSize:12.5, fontWeight:600, color:'var(--text-body)', display:'block', marginBottom:6 }}>Confirm password</label>
                <input type={showPass?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)}
                  placeholder="••••••••" required {...inp()} />
              </div>
            )}

            {mode === 'signin' && (
              <div style={{ textAlign:'right', marginBottom:22 }}>
                <button type="button" onClick={handleForgot} disabled={loading}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:12.5,
                    color:'#2563eb', fontWeight:600, fontFamily:'var(--font-sans)', padding:0 }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'12px', borderRadius:10, border:'none',
                cursor: loading ? 'not-allowed' : 'pointer', marginTop: mode==='signup' ? 18 : 0,
                background: loading ? '#93c5fd' : '#2563eb', color:'white', fontWeight:700, fontSize:14.5,
                fontFamily:'var(--font-sans)', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,0.35)', transition:'all 0.15s' }}>
              {loading
                ? <><span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,0.35)', borderTop:'2px solid white',
                    borderRadius:'50%', animation:'tf-spin 0.75s linear infinite', display:'inline-block' }} /> Please wait…</>
                : <>{mode === 'signin' ? 'Sign in' : 'Create account'} <Icon name="arrow-right" size={15} /></>
              }
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:22, fontSize:13, color:'var(--text-muted)' }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => switchMode(mode==='signin'?'signup':'signin')}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#2563eb',
                fontWeight:700, fontFamily:'var(--font-sans)', fontSize:13, padding:0 }}>
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p style={{ textAlign:'center', marginTop:28, fontSize:11.5, color:'var(--text-subtle)' }}>
            By signing in you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>

      <style>{`@keyframes tf-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

Object.assign(window, { AuthScreen });
})();
