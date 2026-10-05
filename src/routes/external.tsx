import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CellExplorerPanel } from "@/components/viewer/CellExplorerPanel";
import { EXTERNAL_MODELS } from "@/data/externalModels";

export const Route = createFileRoute("/external")({
  head: () => ({
    meta: [
      { title: "External Visualization — ALPHA AI Drug Interaction Simulator" },
      {
        name: "description",
        content:
          "A visual-only 3D showcase of two external molecular models, presented for demonstration purposes without any analysis.",
      },
      { property: "og:title", content: "External Visualization — 3D Model Showcase" },
      {
        property: "og:description",
        content: "Explore two external 3D models in an interactive viewer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExternalVisualization,
});

function ExternalVisualization() {
  return (
    <main className="surface-hero min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/">
            <ArrowLeft className="mr-1.5 size-4" /> Home
          </Link>
        </Button>

        <header className="mt-4">
          <span className="label-mono text-accent">Visual demonstration</span>
          <h1 className="mt-2 flex items-center gap-3 text-4xl font-bold md:text-5xl">
            <span className="rounded-lg border border-primary/40 bg-primary/10 p-2 text-primary">
              <Boxes className="size-7" />
            </span>
            External <span className="text-primary">Visualization</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            These external 3D models are displayed purely for visual demonstration. No simulation,
            scoring or interaction analysis is performed in this section.
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-1">
          {EXTERNAL_MODELS.map((m) => (
            <section key={m.id} className="panel p-4">
              {m.modelUrl ? (
                <CellExplorerPanel className="h-[520px] md:h-[720px]" url={m.modelUrl} label={m.name} />
              ) : (
                <div className="flex h-[420px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 text-center md:h-[640px]">

                  <Boxes className="size-6 text-muted-foreground" />
                  <p className="label-mono text-muted-foreground">Model slot empty</p>
                  <p className="text-xs text-muted-foreground">
                    Upload the 3D model for this slot and it will appear here automatically.
                  </p>
                </div>
              )}
              <h2 className="mt-4 text-lg font-semibold">{m.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{m.caption}</p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Drag to rotate · Scroll to zoom · Right-drag to pan
        </p>
      </div>
    </main>
  );
}
