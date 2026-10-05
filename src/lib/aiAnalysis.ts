import { PROVIDERS, type ProviderId } from "@/lib/alphamedi";
import type { InteractionLevel } from "@/data/demoInteractions";

export type AiAnalysisResult = {
  level: InteractionLevel;
  score: number;
  explanation: string;
  model: string;
  provider: ProviderId;
};

const SYSTEM_PROMPT =
  "You are the analysis engine of the ALPHA AI Drug Interaction Simulator, an educational tool. " +
  "Given the names/metadata of a user-uploaded drug (ligand) 3D model and a protein target 3D model, " +
  "produce a plausible EDUCATIONAL interaction assessment. You never claim clinical accuracy. " +
  'Reply with ONLY compact JSON: {"level":"HIGH"|"MEDIUM"|"LOW","score":<0-100 integer>,"explanation":"<2-4 sentences>"}';

export function isValidKey(provider: ProviderId, key: string) {
  return key.trim().startsWith(PROVIDERS[provider].keyPrefix);
}

export async function runAiAnalysis(opts: {
  provider: ProviderId;
  apiKey: string;
  model: string;
  drug: { name: string; size: number };
  protein: { name: string; size: number };
  signal?: AbortSignal;
}): Promise<AiAnalysisResult> {
  const cfg = PROVIDERS[opts.provider];
  const userPrompt = [
    "Uploaded drug / ligand model:",
    `- file name: ${opts.drug.name}`,
    `- file size: ${(opts.drug.size / 1024).toFixed(0)} KB`,
    "Uploaded protein / target model:",
    `- file name: ${opts.protein.name}`,
    `- file size: ${(opts.protein.size / 1024).toFixed(0)} KB`,
    "",
    "Give the educational interaction level, score and explanation as JSON.",
  ].join("\n");

  const res = await fetch(cfg.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
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
    if (res.status === 401 || res.status === 403)
      throw new Error(`Invalid or unauthorised API key. ${detail}`.trim());
    if (res.status === 429) throw new Error(`Rate limit or quota reached. ${detail}`.trim());
    throw new Error(detail || `Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  let parsed: { level?: string; score?: number; explanation?: string } = {};
  if (match) {
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      /* fall through */
    }
  }

  const level = (["HIGH", "MEDIUM", "LOW"] as const).includes(
    String(parsed.level).toUpperCase() as InteractionLevel,
  )
    ? (String(parsed.level).toUpperCase() as InteractionLevel)
    : "MEDIUM";
  const score = Number.isFinite(Number(parsed.score))
    ? Math.max(0, Math.min(100, Math.round(Number(parsed.score))))
    : 50;

  return {
    level,
    score,
    explanation:
      parsed.explanation?.trim() ||
      raw ||
      "The model returned no explanation. This result is educational only.",
    model: opts.model,
    provider: opts.provider,
  };
}
