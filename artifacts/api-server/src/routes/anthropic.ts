import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// Basic abuse mitigation for the (unauthenticated) AI proxy: cap input sizes
// and apply a simple in-memory per-IP rate limit so the ANTHROPIC_API_KEY
// cannot be drained by unbounded requests.
const MAX_PROMPT_CHARS = 8000;
const MAX_SYSTEM_CHARS = 4000;
const MAX_TOKENS_CAP = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;

const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

router.post("/anthropic/generate", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res
      .status(503)
      .json({ error: "خدمة الذكاء الاصطناعي غير مهيأة. لم يتم ضبط مفتاح Anthropic." });
    return;
  }

  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "تم تجاوز الحد المسموح من الطلبات. حاول بعد قليل." });
    return;
  }

  const { system, prompt, maxTokens } = req.body ?? {};
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "النص المطلوب غير صالح." });
    return;
  }
  if (prompt.length > MAX_PROMPT_CHARS || (typeof system === "string" && system.length > MAX_SYSTEM_CHARS)) {
    res.status(413).json({ error: "النص المُرسل أطول من الحد المسموح." });
    return;
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: Math.min(typeof maxTokens === "number" ? maxTokens : 1200, MAX_TOKENS_CAP),
        system: typeof system === "string" ? system : undefined,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      res
        .status(upstream.status)
        .json({ error: `فشل طلب الذكاء الاصطناعي: ${errText.slice(0, 300)}` });
      return;
    }

    const data = (await upstream.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("\n")
      .trim();

    res.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير معروف";
    res.status(500).json({ error: `تعذر الاتصال بالخدمة: ${message}` });
  }
});

export default router;
