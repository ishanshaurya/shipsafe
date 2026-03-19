import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import Layout from "./components/Layout"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Debugger from "./pages/Debugger"
import Loopholes from "./pages/Loopholes"
import Audit from "./pages/Audit"
import Regulations from "./pages/Regulations"
import DeployCheck from "./pages/DeployCheck"
import StressTest from "./pages/StressTest"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/debugger" element={<Debugger />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/regulations" element={<Regulations />} />
            <Route path="/loopholes" element={<Loopholes />} />
            <Route path="/deploy-check" element={<DeployCheck />} />
            <Route path="/stress-test" element={<StressTest />} />
          </Route>
          <Route path="*" element={<div style={{ padding: 60, textAlign: "center" }}><h1 style={{ color: "#f1f5f9" }}>404</h1></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
