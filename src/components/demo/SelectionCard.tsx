import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  subtitle: string;
  summary: string;
  selected: boolean;
  onSelect: () => void;
  tone?: "primary" | "accent";
};

export function SelectionCard({
  name,
  subtitle,
  summary,
  selected,
  onSelect,
  tone = "primary",
}: Props) {
  const toneText = tone === "accent" ? "text-accent" : "text-primary";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`panel group w-full p-4 text-left transition-all hover:-translate-y-0.5 ${
        selected ? "glow-ring" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`label-mono ${toneText}`}>{subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold">{name}</h3>
        </div>
        {selected && (
          <span className="rounded-full bg-primary p-1 text-primary-foreground">
            <Check className="size-3.5" />
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
      <Button
        asChild
        size="sm"
        variant={selected ? "default" : "secondary"}
        className="mt-4 w-full"
      >
        <span>{selected ? "Selected" : "Select"}</span>
      </Button>
    </button>
  );
}
