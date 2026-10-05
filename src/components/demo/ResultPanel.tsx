import type { DemoInteraction } from "@/data/demoInteractions";
import type { Drug } from "@/data/drugs";
import type { Protein } from "@/data/proteins";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";

const levelTone: Record<string, string> = {
  HIGH: "text-accent",
  MEDIUM: "text-primary",
  LOW: "text-destructive",
};

export function ResultPanel({
  drug,
  protein,
  result,
  onRunAgain,
  onBack,
}: {
  drug: Drug;
  protein: Protein;
  result: DemoInteraction;
  onRunAgain: () => void;
  onBack: () => void;
}) {
  return (
    <div className="panel p-5">
      <p className="label-mono text-muted-foreground">Demo interaction result</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="label-mono text-muted-foreground">Drug</dt>
          <dd className="mt-1 font-semibold">{drug.name}</dd>
        </div>
        <div>
          <dt className="label-mono text-muted-foreground">Target</dt>
          <dd className="mt-1 font-semibold">{protein.name}</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
        <p className="label-mono text-muted-foreground">Interaction level</p>
        <p className={`font-display text-3xl font-bold ${levelTone[result.level]}`}>
          {result.level}
        </p>

        <p className="label-mono mt-4 text-muted-foreground">Demo score</p>
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
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={onRunAgain}>
          <RefreshCw className="mr-1.5 size-4" /> Run again
        </Button>
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="mr-1.5 size-4" /> Back to demo
        </Button>
      </div>
    </div>
  );
}
