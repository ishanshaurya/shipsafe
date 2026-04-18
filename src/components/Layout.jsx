import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Bug, Search, Scale, KeyRound, Rocket, FlaskConical, Menu, X, LogOut, User } from 'lucide-react'
import Logo from './Logo'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useIsMobile } from '../hooks/useIsMobile'

const NAV = [
  { path: '/dashboard',    label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/debugger',     label: 'AI Debugger',     icon: Bug },
  { path: '/audit',        label: 'Vibe-Code Audit', icon: Search },
  { path: '/regulations',  label: 'Regulations',     icon: Scale },
  { path: '/loopholes',    label: 'Loopholes',       icon: KeyRound },
  { path: '/deploy-check', label: 'Deploy Check',    icon: Rocket },
  { path: '/stress-test',  label: 'Stress Test',     icon: FlaskConical },
]

export default function Layout() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(!isMobile)

  useEffect(() => { setOpen(!isMobile) }, [isMobile])
  useEffect(() => { if (isMobile) setOpen(false) }, [location.pathname, isMobile])

  const current = NAV.find(n => n.path === location.pathname)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; text-decoration:none; font-size:13px; font-weight:500; transition:all 0.15s; border:1px solid transparent; color:rgba(255,255,255,0.4); }
        .nav-item:hover { color:rgba(255,255,255,0.8); background:rgba(255,255,255,0.04); }
        .nav-item.active { color:#fff; background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.08); }
        .sign-out { background:none; border:1px solid rgba(255,255,255,0.08); border-radius:6px; color:rgba(255,255,255,0.4); cursor:pointer; padding:6px 12px; font-size:12px; transition:all 0.15s; font-family:inherit; }
        .sign-out:hover { border-color:rgba(255,255,255,0.15); color:rgba(255,255,255,0.7); }
      `}</style>

      {/* Mobile backdrop */}
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:49 }} />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#050505',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: isMobile ? (open ? 'translateX(0)' : 'translateX(-220px)') : 'translateX(0)',
        transition: 'transform 0.2s ease',
      }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
          <Logo size={26} />
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff', letterSpacing:'-0.02em' }}>ShipSafe</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', letterSpacing:'0.12em', marginTop:2 }}>BUILD · VALIDATE · DEPLOY</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {NAV.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <NavLink key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={15} style={{ flexShrink:0 }} />
                <span style={{ flex:1 }}>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          {user ? (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(52,211,153,0.15)', border:'1px solid rgba(52,211,153,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <User size={13} color="#34d399" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
              </div>
              <button onClick={signOut} className="sign-out" style={{ padding:'5px 8px', flexShrink:0 }}>
                <LogOut size={12} />
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, marginLeft: isMobile ? 0 : 220, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Topbar */}
        <header style={{
          height:52, borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 24px', position:'sticky', top:0,
          background:'rgba(0,0,0,0.9)', backdropFilter:'blur(12px)', zIndex:40,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {isMobile && (
              <button onClick={() => setOpen(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
                <Menu size={18} />
              </button>
            )}
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>ShipSafe</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.15)' }}>/</span>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:500 }}>
              {current?.label || location.pathname.slice(1)}
            </span>
          </div>
          {isMobile && user && (
            <button onClick={signOut} className="sign-out">Sign out</button>
          )}
        </header>

        {/* Content */}
        <main style={{ flex:1, padding: isMobile ? '16px' : '32px 36px', maxWidth:1200, width:'100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
