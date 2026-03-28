// src/components/ReportButton.jsx
//
// Drop this into any tool page's result panel.
// Props:
//   scanType   — "debugger" | "audit" | "loopholes" | "deploy-check" | "stress-test"
//   title      — human-readable report title
//   resultData — the full scan result object (button is hidden if null)
//   user       — from useAuth(), used to show "sign in" prompt instead

import { useState } from "react"
import { Share2, Loader2, Check, Copy, AlertCircle } from "lucide-react"
import { useReport } from "../hooks/useReport"

export default function ReportButton({ scanType, title, resultData }) {
  const { generating, reportUrl, reportError, generateReport } = useReport()
  const [copied, setCopied] = useState(false)

  if (!resultData) return null

  const copy = () => {
    navigator.clipboard.writeText(reportUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // After report is generated — show the URL + copy button
  if (reportUrl) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        padding: "12px 16px", borderRadius: 10,
        background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)"
      }}>
        <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: "#34d399", fontWeight: 600 }}>Report ready</span>
        <a href={reportUrl} target="_blank" rel="noreferrer" style={{
          fontSize: 11, color: "#94a3b8", textDecoration: "none", flex: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>{reportUrl}</a>
        <button onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 7, border: "1px solid rgba(34,197,94,0.3)",
          background: "transparent", color: copied ? "#34d399" : "#94a3b8",
          fontSize: 11, cursor: "pointer", flexShrink: 0
        }}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={() => generateReport({ scanType, title, resultData })}
        disabled={generating}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "11px 20px", borderRadius: 10,
          border: "1px solid rgba(56,189,248,0.2)",
          background: "rgba(56,189,248,0.06)",
          color: generating ? "#475569" : "#38bdf8",
          fontSize: 13, fontWeight: 600,
          cursor: generating ? "not-allowed" : "pointer",
          width: "100%"
        }}
      >
        {generating
          ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving report...</>
          : <><Share2 size={14} /> Generate public report</>
        }
      </button>
      {reportError && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "#ef4444" }}>
          <AlertCircle size={12} /> {reportError}
        </div>
      )}
    </div>
  )
}
