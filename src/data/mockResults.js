// src/data/mockResults.js
// ─── Centralized mock/demo data ─────────────────────────
// Extracted from page components so they stay clean.
// These are shown to logged-out users as demo data.

export const MOCK_SCANS = [
  { id: 1, type: "debugger", title: "Express.js REST API", score: 22, issues: 9, time: "2 hours ago", color: "#ef4444" },
  { id: 2, type: "audit", title: "my-ai-app project", score: 35, issues: 17, time: "3 hours ago", color: "#f97316" },
  { id: 3, type: "loopholes", title: "Facial Recognition System", score: 72, issues: 4, time: "5 hours ago", color: "#a855f7" },
  { id: 4, type: "deploy-check", title: "Vercel + Supabase config", score: 45, issues: 6, time: "1 day ago", color: "#22c55e" },
  { id: 5, type: "stress-test", title: "Vercel free tier stack", score: null, issues: 3, time: "1 day ago", color: "#eab308" },
]

export const SCAN_COLORS = {
  debugger: "#ef4444",
  audit: "#f97316",
  loopholes: "#a855f7",
  "deploy-check": "#22c55e",
  "stress-test": "#eab308",
}
