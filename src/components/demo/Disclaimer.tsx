import { AlertTriangle } from "lucide-react";
import { DISCLAIMER } from "@/data/demoInteractions";

export function DemoBadge() {
  return (
    <span className="label-mono rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">
      Demo Mode
    </span>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-xs leading-relaxed text-muted-foreground ${className}`}
    >
      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent" />
      <span>{DISCLAIMER}</span>
    </p>
  );
}
