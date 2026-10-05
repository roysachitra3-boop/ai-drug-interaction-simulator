import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, FlaskConical, Sparkles, ArrowRight, Users, Boxes, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge, Disclaimer } from "@/components/demo/Disclaimer";
import { DRUGS } from "@/data/drugs";
import { PROTEINS } from "@/data/proteins";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALPHA AI Drug Interaction Simulator" },
      {
        name: "description",
        content:
          "Interactive educational 3D demonstration of drug and protein interactions with predefined molecular models.",
      },
      { property: "og:title", content: "ALPHA AI Drug Interaction Simulator" },
      {
        property: "og:description",
        content: "Explore drug-protein interactions in 3D with a guided educational demo.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="surface-hero min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary">
              <Atom className="size-5" />
            </span>
            <span className="label-mono text-muted-foreground">Alpha · Version 1</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
          </div>

        </div>

        <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
          ALPHA AI
          <br />
          <span className="text-primary">Drug Interaction Simulator</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          An educational computational demonstration. Choose a predefined drug model and a protein
          target, run the demo sequence, and explore the molecules together in an interactive 3D
          viewer.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="panel flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-accent/15 p-2 text-accent">
                <FlaskConical className="size-5" />
              </span>
              <DemoBadge />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Demo Analysis</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {DRUGS.length} drug models · {PROTEINS.length} protein targets · predefined
              demonstration results and full 3D visualisation.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/demo">
                Open Demo Analysis <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>

          <div className="panel flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Sparkles className="size-5" />
              </span>
              <span className="label-mono rounded-full border border-primary/40 px-3 py-1 text-primary">
                Multi-LLM
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold">AI Analysis</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Upload your own drug and protein models, connect a Groq or OpenRouter key and generate
              an AI interaction analysis with full 3D visualisation.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/ai">
                Open AI Analysis <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Disclaimer className="mt-10 max-w-2xl" />
      </div>
    </main>
  );
}
