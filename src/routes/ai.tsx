import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Upload, Play, KeyRound, Sparkles, RefreshCw, Users, Boxes, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimulationSequence } from "@/components/demo/SimulationSequence";
import { DemoBadge, Disclaimer } from "@/components/demo/Disclaimer";
import { ViewerPanel } from "@/components/viewer/ViewerPanel";
import { PROVIDERS, type ProviderId } from "@/lib/alphamedi";
import { isValidKey, runAiAnalysis, type AiAnalysisResult } from "@/lib/aiAnalysis";
import { getStored, setStored } from "@/lib/safeStorage";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Analysis — ALPHA AI Drug Interaction Simulator" },
      {
        name: "description",
        content:
          "Upload your own drug and protein 3D models, connect a Groq or OpenRouter key and generate an AI interaction analysis in 3D.",
      },
      { property: "og:title", content: "AI Analysis — Drug Interaction Simulator" },
      {
        property: "og:description",
        content: "Upload drug and protein models and run a multi-LLM powered interaction analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiAnalysis,
});

type Uploaded = { name: string; size: number; url: string };
type Stage = "setup" | "simulating" | "result";

const KEY_STORAGE = "alpha-ai-analysis-key";

const levelTone: Record<string, string> = {
  HIGH: "text-accent",
  MEDIUM: "text-primary",
  LOW: "text-destructive",
};

function UploadSlot({
  title,
  hint,
  file,
  onPick,
}: {
  title: string;
  hint: string;
  file: Uploaded | null;
  onPick: (f: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="panel flex flex-col items-center p-5 text-center">
      <span className="rounded-lg bg-primary/10 p-2 text-primary">
        <Upload className="size-5" />
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <input
        ref={input}
        type="file"
        accept=".glb,.gltf,model/gltf-binary"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      <Button className="mt-4" variant={file ? "secondary" : "default"} onClick={() => input.current?.click()}>
        {file ? "Replace model" : "Upload model"}
      </Button>
      {file && (
        <p className="mt-3 max-w-full truncate font-mono text-xs text-accent" title={file.name}>
          {file.name} · {(file.size / 1024).toFixed(0)} KB
        </p>
      )}
    </div>
  );
}

function AiAnalysis() {
  const [drug, setDrug] = useState<Uploaded | null>(null);
  const [protein, setProtein] = useState<Uploaded | null>(null);
  const [provider, setProvider] = useState<ProviderId>("groq");
  const [model, setModel] = useState(PROVIDERS.groq.models[0]!.id);
  const [apiKey, setApiKey] = useState("");
  const [stage, setStage] = useState<Stage>("setup");
  const [result, setResult] = useState<AiAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const saved = getStored(KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  const pick = (kind: "drug" | "protein") => (f: File) => {
    const entry = { name: f.name, size: f.size, url: URL.createObjectURL(f) };
    if (kind === "drug") setDrug(entry);
    else setProtein(entry);
    setResult(null);
    setStage("setup");
  };

  const keyOk = isValidKey(provider, apiKey);
  const ready = Boolean(drug && protein && keyOk);

  const start = useCallback(async () => {
    if (!drug || !protein) return;
    setError(null);
    setResult(null);
    setPending(true);
    setStage("simulating");
    setStored(KEY_STORAGE, apiKey.trim());
    try {
      const r = await runAiAnalysis({
        provider,
        apiKey: apiKey.trim(),
        model,
        drug: { name: drug.name, size: drug.size },
        protein: { name: protein.name, size: protein.size },
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed.");
      setStage("setup");
    } finally {
      setPending(false);
    }
  }, [drug, protein, provider, apiKey, model]);

  const onSequenceComplete = useCallback(() => {
    if (pending) return;
    if (result) setStage("result");
  }, [pending, result]);

  useEffect(() => {
    if (stage === "simulating" && !pending && result) setStage("result");
  }, [stage, pending, result]);

  return (
    <main className="surface-hero min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2">
              <Link to="/">
                <ArrowLeft className="mr-1.5 size-4" /> Home
              </Link>
            </Button>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">AI Analysis</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/demo">Demo Analysis</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/team">
                <Users className="mr-1.5 size-4" /> Team Alpha
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/external">
                <Boxes className="mr-1.5 size-4" /> External Visualization
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://alpha-care-guide.lovable.app/">
                <Bot className="mr-1.5 size-4" /> Alpha Medi
              </a>
            </Button>
            <DemoBadge />
          </div>
        </header>

        {/* Multi-LLM system */}
        <section className="panel mt-6 p-5">
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <h2 className="label-mono text-primary">Multi-LLM system</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr_220px]">
            <select
              className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm"
              value={provider}
              onChange={(e) => {
                const p = e.target.value as ProviderId;
                setProvider(p);
                setModel(PROVIDERS[p].models[0]!.id);
              }}
            >
              {Object.values(PROVIDERS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Paste your ${PROVIDERS[provider].name} API key (${PROVIDERS[provider].keyHint})`}
            />
            <select
              className="h-10 rounded-md border border-border bg-secondary/40 px-3 text-sm"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {PROVIDERS[provider].models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            The key stays in your browser only and is sent directly to {PROVIDERS[provider].name}.{" "}
            <a className="underline" href={PROVIDERS[provider].keyUrl} target="_blank" rel="noreferrer">
              Get a key
            </a>
            {apiKey && !keyOk && (
              <span className="ml-2 text-destructive">
                Key should start with {PROVIDERS[provider].keyPrefix}
              </span>
            )}
          </p>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <ViewerPanel
            className="h-[420px] md:h-[560px]"
            drugUrl={drug?.url}
            proteinUrl={protein?.url}
            drugLabel={drug ? drug.name : "No drug model uploaded"}
            proteinLabel={protein ? protein.name : "No protein model uploaded"}
            active={stage !== "setup"}
          />


          <div className="space-y-6">
            {stage === "setup" && (
              <>
                <div className="grid gap-4">
                  <UploadSlot
                    title="Upload Drug Model"
                    hint="GLB / GLTF ligand structure"
                    file={drug}
                    onPick={pick("drug")}
                  />
                  <UploadSlot
                    title="Upload Protein Model"
                    hint="GLB / GLTF target structure"
                    file={protein}
                    onPick={pick("protein")}
                  />
                </div>

                <Button size="lg" className="w-full" disabled={!ready} onClick={start}>
                  <Play className="mr-1.5 size-4" /> Run AI interaction analysis
                </Button>
                {!ready && (
                  <p className="text-center text-xs text-muted-foreground">
                    Upload both models and paste a valid Groq or OpenRouter key to enable analysis.
                  </p>
                )}
                {error && (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                    {error}
                  </p>
                )}
              </>
            )}

            {stage === "simulating" && <SimulationSequence onComplete={onSequenceComplete} />}

            {stage === "result" && result && drug && protein && (
              <div className="panel p-5">
                <p className="label-mono text-muted-foreground">AI interaction result</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="label-mono text-muted-foreground">Drug model</dt>
                    <dd className="mt-1 truncate font-semibold" title={drug.name}>
                      {drug.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-mono text-muted-foreground">Protein model</dt>
                    <dd className="mt-1 truncate font-semibold" title={protein.name}>
                      {protein.name}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
                  <p className="label-mono text-muted-foreground">Interaction level</p>
                  <p className={`font-display text-3xl font-bold ${levelTone[result.level]}`}>
                    {result.level}
                  </p>
                  <p className="label-mono mt-4 text-muted-foreground">AI score</p>
                  <p className="font-mono text-xl">{result.score} / 100</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="label-mono text-muted-foreground">Explanation</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {result.explanation}
                  </p>
                </div>

                <p className="label-mono mt-4 flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="size-3.5" /> {PROVIDERS[result.provider].name} · {result.model}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button onClick={start}>
                    <RefreshCw className="mr-1.5 size-4" /> Run again
                  </Button>
                  <Button variant="secondary" onClick={() => setStage("setup")}>
                    <ArrowLeft className="mr-1.5 size-4" /> Change models
                  </Button>
                </div>
              </div>
            )}

            <Disclaimer />
          </div>
        </div>
      </div>
    </main>
  );
}
