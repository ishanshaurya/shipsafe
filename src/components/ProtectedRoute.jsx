import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#050505", gap: 14,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{
          width: 36, height: 36,
          border: "2px solid rgba(52,211,153,0.1)",
          borderTopColor: "#34d399",
          borderRadius: "50%",
          animation: "_spin 0.9s linear infinite",
        }} />
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
          LOADING
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
