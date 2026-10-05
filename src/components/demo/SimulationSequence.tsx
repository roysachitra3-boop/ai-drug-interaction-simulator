import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { SIMULATION_STEPS, STEP_DURATION_MS } from "@/lib/simulation";

export function SimulationSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= SIMULATION_STEPS.length) {
      const done = setTimeout(onComplete, 400);
      return () => clearTimeout(done);
    }
    const t = setTimeout(() => setStep((s) => s + 1), STEP_DURATION_MS);
    return () => clearTimeout(t);
  }, [step, onComplete]);

  return (
    <div className="panel mx-auto w-full max-w-md p-6">
      <p className="label-mono text-primary">Demo sequence running</p>
      <ul className="mt-4 space-y-3">
        {SIMULATION_STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li
              key={label}
              className={`flex items-center gap-3 text-sm transition-opacity ${
                done || active ? "opacity-100" : "opacity-35"
              }`}
            >
              {done ? (
                <Check className="size-4 text-accent" />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <span className="size-4 rounded-full border border-border" />
              )}
              <span className={done ? "text-muted-foreground" : ""}>{label}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(step / SIMULATION_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
