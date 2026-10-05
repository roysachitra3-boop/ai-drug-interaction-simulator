import { MEMBERS, MENTORS, TEAM_ABOUT, TEAM_MOTTO, TEAM_SCHOOL, TEAM_TAGLINE, FOCUS_AREAS, WORKFLOW } from "@/data/teamAlpha";

export type ProviderId = "groq" | "openrouter";

export type ProviderConfig = {
  id: ProviderId;
  name: string;
  endpoint: string;
  keyPrefix: string;
  keyHint: string;
  keyUrl: string;
  models: { id: string; label: string }[];
};

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  groq: {
    id: "groq",
    name: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    keyPrefix: "gsk_",
    keyHint: "gsk_...",
    keyUrl: "https://console.groq.com/keys",
    models: [
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
      { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B" },
      { id: "qwen/qwen3-32b", label: "Qwen 3 32B" },
    ],
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    keyPrefix: "sk-or-",
    keyHint: "sk-or-v1-...",
    keyUrl: "https://openrouter.ai/keys",
    models: [
      { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
      { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
      { id: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
      { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B Instruct" },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Question routing
 * ------------------------------------------------------------------ */

export type QuestionCategory = "internal" | "medical";

const INTERNAL_PATTERNS: RegExp[] = [
  /\b(who|whose|whom)\b[^?]*\b(creat|develop|made|make|built|build|behind|design|found|contribut|program|code)/i,
  /\b(team\s*alpha|alpha\s*medi|alphagpt|alpha\s*gpt|advance[d]?\s*database)\b/i,
  /\b(creator|creators|developer|developers|contributor|contributors|founder|founders)\b/i,
  /\b(this|the)\s+(project|app|application|website|system|simulator)\b[^?]*\b(who|made|creat|develop|built|about|behind)/i,
  /\b(about|tell me about)\b[^?]*\b(team|project|developers?|creators?)\b/i,
  /\b(milestone school|internal (project )?(data|database|information))\b/i,
];

export function classifyQuestion(text: string): QuestionCategory {
  return INTERNAL_PATTERNS.some((r) => r.test(text)) ? "internal" : "medical";
}

/* ------------------------------------------------------------------ *
 * Knowledge sources
 * ------------------------------------------------------------------ */

export function buildAdvancedDatabaseContext(): string {
  const members = MEMBERS.map(
    (m) => `- ${m.name}${m.code ? ` (ID ${m.code})` : ""}${m.note ? ` — ${m.note}` : ""}`,
  ).join("\n");
  const mentors = MENTORS.map((m) => `- ${m.name} — ${m.role}`).join("\n");
  return [
    "ADVANCED DATABASE (internal records about Alpha Medi, the Alpha Project and Team Alpha):",
    `Project: Alpha Medi Mode (a basic Medical AI) inside the AI Drug Interaction Simulator, built by Team Alpha.`,
    `Team: Team Alpha — ${TEAM_TAGLINE}.`,
    `School: ${TEAM_SCHOOL}`,
    `Motto: ${TEAM_MOTTO}`,
    ...TEAM_ABOUT,
    `Focus areas: ${FOCUS_AREAS.join(", ")}.`,
    `Workflow: ${WORKFLOW.join(" → ")}.`,
    `Members (creators / developers / contributors):\n${members}`,
    `Mentors and faculty:\n${mentors}`,
  ].join("\n\n");
}

export const MEDICAL_SYSTEM_PROMPT =
  "You are Alpha Medi, a basic Medical Science AI built by Team Alpha. " +
  "Answer Medical Science questions (anatomy, physiology, biochemistry, microbiology, pathology, " +
  "pharmacology, genetics, immunology, molecular biology, diseases, medical terminology, body systems, " +
  "medical technology, biomedical science and related fields) clearly and accurately, in student-friendly language. " +
  "If a question is NOT medical science related and is not about your creators or the Alpha project, politely reply " +
  "that Alpha Medi Mode is designed specifically for Medical Science questions, and invite a medical question instead. " +
  "Always note that answers are educational only and never a substitute for professional medical advice.";

export const INTERNAL_SYSTEM_PROMPT =
  "You are Alpha Medi, a basic Medical Science AI built by Team Alpha. " +
  "The user is asking about your creators, developers, contributors, the Alpha project, Team Alpha or the internal " +
  "Advanced Database. Answer ONLY from the Advanced Database records provided below. Do not invent names or facts. " +
  "Present the information in a clear, organised way.\n\n" +
  buildAdvancedDatabaseContext();

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function sendChat(opts: {
  provider: ProviderId;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
  signal?: AbortSignal;
}): Promise<{ text: string; source: QuestionCategory }> {
  const cfg = PROVIDERS[opts.provider];
  const lastUser = [...opts.messages].reverse().find((m) => m.role === "user");
  const source = classifyQuestion(lastUser?.content ?? "");
  const system = source === "internal" ? INTERNAL_SYSTEM_PROMPT : MEDICAL_SYSTEM_PROMPT;

  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [{ role: "system", content: system }, ...opts.messages],
      temperature: source === "internal" ? 0.2 : 0.6,
    }),
    ...(opts.signal ? { signal: opts.signal } : {}),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = (await res.json()) as { error?: { message?: string } };
      detail = data?.error?.message ?? "";
    } catch {
      detail = await res.text().catch(() => "");
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(`Invalid or unauthorised API key. ${detail}`.trim());
    }
    if (res.status === 429) {
      throw new Error(`Rate limit or quota reached. ${detail}`.trim());
    }
    throw new Error(detail || `Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return {
    text: data.choices?.[0]?.message?.content?.trim() || "(empty response)",
    source,
  };
}
