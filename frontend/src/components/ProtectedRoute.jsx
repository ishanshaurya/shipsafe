import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0f1117",
        color: "#94a3b8",
        fontSize: "14px",
        fontFamily: "monospace"
      }}>
        Checking auth...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
