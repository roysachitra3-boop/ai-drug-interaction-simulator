import { useCallback, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Users, Boxes, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectionCard } from "@/components/demo/SelectionCard";
import { SimulationSequence } from "@/components/demo/SimulationSequence";
import { ResultPanel } from "@/components/demo/ResultPanel";
import { DemoBadge, Disclaimer } from "@/components/demo/Disclaimer";
import { ViewerPanel } from "@/components/viewer/ViewerPanel";
import { DRUGS, getDrug } from "@/data/drugs";
import { PROTEINS, getProtein } from "@/data/proteins";
import { getDemoInteraction } from "@/data/demoInteractions";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo Analysis — ALPHA AI Drug Interaction Simulator" },
      {
        name: "description",
        content:
          "Select a predefined drug and protein model, run the demo simulation and view the interaction result in 3D.",
      },
      { property: "og:title", content: "Demo Analysis — Drug Interaction Simulator" },
      {
        property: "og:description",
        content: "Predefined 3D drug and protein models with an educational interaction demo.",
      },
    ],
  }),
  component: DemoAnalysis,
});

type Stage = "select" | "simulating" | "result";

function DemoAnalysis() {
  const [drugId, setDrugId] = useState<string | null>(null);
  const [proteinId, setProteinId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("select");

  const drug = getDrug(drugId);
  const protein = getProtein(proteinId);
  const ready = Boolean(drug && protein);

  const result = useMemo(
    () => (drug && protein ? getDemoInteraction(drug.id, protein.id) : null),
    [drug, protein],
  );

  const start = useCallback(() => setStage("simulating"), []);
  const complete = useCallback(() => setStage("result"), []);

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
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Demo Analysis</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/ai">
                <Sparkles className="mr-1.5 size-4" /> AI Analysis
              </Link>
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

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <ViewerPanel
            className="h-[420px] md:h-[560px]"
            drugUrl={drug?.modelUrl}
            proteinUrl={protein?.modelUrl}
            drugLabel={drug?.name ?? "No drug selected"}
            proteinLabel={protein?.name ?? "No protein selected"}
            active={stage !== "select"}
          />


          <div className="space-y-6">
            {stage === "select" && (
              <>
                <section>
                  <h2 className="label-mono text-accent">Step 1 · Select drug</h2>
                  <div className="mt-3 space-y-3">
                    {DRUGS.map((d) => (
                      <SelectionCard
                        key={d.id}
                        name={d.name}
                        subtitle={d.formula}
                        summary={d.summary}
                        tone="accent"
                        selected={drugId === d.id}
                        onSelect={() => setDrugId(d.id)}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="label-mono text-primary">Step 2 · Select protein target</h2>
                  <div className="mt-3 space-y-3">
                    {PROTEINS.map((p) => (
                      <SelectionCard
                        key={p.id}
                        name={p.name}
                        subtitle={p.role}
                        summary={p.summary}
                        selected={proteinId === p.id}
                        onSelect={() => setProteinId(p.id)}
                      />
                    ))}
                  </div>
                </section>

                <Button size="lg" className="w-full" disabled={!ready} onClick={start}>
                  <Play className="mr-1.5 size-4" /> Start demo simulation
                </Button>
                {!ready && (
                  <p className="text-center text-xs text-muted-foreground">
                    Select one drug and one protein to enable the simulation.
                  </p>
                )}
              </>
            )}

            {stage === "simulating" && <SimulationSequence onComplete={complete} />}

            {stage === "result" && drug && protein && result && (
              <ResultPanel
                drug={drug}
                protein={protein}
                result={result}
                onRunAgain={() => setStage("simulating")}
                onBack={() => setStage("select")}
              />
            )}

            <Disclaimer />
          </div>
        </div>
      </div>
    </main>
  );
}
