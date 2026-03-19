import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Shield, Mail, Github, Loader2, Eye, EyeOff } from "lucide-react"
import { supabase } from "../lib/supabase"

/* ═══════════════════════════════════════════════════════════
   LOGIN / SIGNUP PAGE — Supabase Auth

   Supports: Email + password, GitHub OAuth
   After login, redirects to /dashboard
   ═══════════════════════════════════════════════════════════ */

export default function Login() {
  const [mode, setMode] = useState("login") // login | signup
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleEmail = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage("Check your email for a confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleGitHub = async () => {
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: window.location.origin + "/dashboard" }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #34d399, #06b6d4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡</div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>ShipSafe</span>
          </Link>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>{mode === "login" ? "Welcome back" : "Create your account"}</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(15,22,40,0.6)", border: "1px solid rgba(56,189,248,0.08)", borderRadius: 16, padding: 32, backdropFilter: "blur(20px)" }}>
          {/* GitHub OAuth */}
          <button onClick={handleGitHub} disabled={loading} style={{
            width: "100%", padding: 14, borderRadius: 10, border: "1px solid rgba(56,189,248,0.15)",
            background: "rgba(15,22,40,0.4)", color: "#e2e8f0", fontSize: 13, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
          }}>
            <Github size={18} /> Continue with GitHub
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(56,189,248,0.08)" }} />
            <span style={{ fontSize: 11, color: "#334155" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(56,189,248,0.08)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={15} color="#475569" style={{ position: "absolute", left: 12, top: 12 }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", background: "#070b12", border: "1px solid rgba(56,189,248,0.08)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, padding: "11px 12px 11px 38px", outline: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <Shield size={15} color="#475569" style={{ position: "absolute", left: 12, top: 12 }} />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" minLength={6}
                  style={{ width: "100%", background: "#070b12", border: "1px solid rgba(56,189,248,0.08)", borderRadius: 8, color: "#e2e8f0", fontSize: 13, padding: "11px 40px 11px 38px", outline: "none" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: 10, background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#ef4444" }}>{error}</div>}
            {message && <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#34d399" }}>{message}</div>}

            <button type="submit" disabled={loading || !email || !password} style={{
              width: "100%", padding: 14, borderRadius: 10, border: "none",
              background: loading ? "#1a2540" : "#34d399", color: loading ? "#334155" : "#0a0e1a",
              fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </form>

          {/* Toggle mode */}
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#475569" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null) }}
              style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/" style={{ fontSize: 12, color: "#334155", textDecoration: "none" }}>← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
