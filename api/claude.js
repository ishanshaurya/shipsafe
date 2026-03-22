// api/claude.js — Vercel Serverless Proxy
// Routes AI requests to Google Gemini 2.5 Flash
// API key lives in Vercel env vars, never in the browser.

const SYSTEM_PROMPTS = {
  debugger: `You are ShipSafe AI Debugger — an expert code reviewer that finds bugs, security vulnerabilities, and "vibe-code" smells.

You MUST respond with ONLY valid JSON — no markdown, no backticks, no explanation outside the JSON.

CRITICAL: Keep your response concise. Maximum 8 issues. Combine similar issues into one.

Response format:
{
  "healthScore": <number 0-100>,
  "summary": "<one sentence>",
  "stats": { "totalIssues": <n>, "critical": <n>, "high": <n>, "medium": <n>, "low": <n> },
  "issues": [
    {
      "id": <number>,
      "line": <number or null>,
      "severity": "critical" | "high" | "medium" | "low",
      "category": "security" | "bug" | "vibecode" | "style",
      "title": "<short title>",
      "description": "<1 sentence>",
      "codeSnippet": "<short problematic code>",
      "fix": "<short fix>"
    }
  ],
  "positives": ["<short positive>"]
}

Rules:
- MAX 8 issues. Prioritize the most important ones.
- Keep descriptions to 1 sentence. Keep fixes short.
- "vibecode" = AI-generated code smells: no error handling, hardcoded values, console.log, unused vars.
- healthScore: 90-100 excellent, 70-89 good, 40-69 needs work, 0-39 critical.
- Respond ONLY with the JSON object.`,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  const {
    code,
    language = "JavaScript",
    context = "",
    tool = "debugger",
  } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: "No code provided" });
  }

  let userPrompt = `Analyze this ${language} code. Return max 8 issues as JSON.\n\n`;
  if (context) userPrompt += `Context: ${context}\n\n`;
  userPrompt += `Code:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``;

  const systemPrompt = SYSTEM_PROMPTS[tool] || SYSTEM_PROMPTS.debugger;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("Gemini error:", response.status, errText.slice(0, 300));
      return res.status(502).json({ error: `Gemini returned ${response.status}` });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(502).json({ error: "Gemini returned empty response" });
    }

    return res.status(200).json({ content, provider: "gemini" });
  } catch (err) {
    console.error("Gemini request failed:", err);
    return res.status(502).json({ error: "Failed to reach Gemini API" });
  }
}
