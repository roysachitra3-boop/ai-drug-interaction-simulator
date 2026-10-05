import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";

const CellExplorer = lazy(() => import("./CellExplorer"));

type Props = {
  url: string;
  label?: string | undefined;
  className?: string;
};

const Placeholder = () => (
  <div className="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card text-xs tracking-widest text-muted-foreground">
    INITIALISING CELL EXPLORER…
  </div>
);

export function CellExplorerPanel({ className, ...props }: Props) {
  return (
    <div className={className}>
      <ClientOnly fallback={<Placeholder />}>
        <ViewerErrorBoundary label="The interactive cell could not be displayed">
          <Suspense fallback={<Placeholder />}>
            <CellExplorer {...props} />
          </Suspense>
        </ViewerErrorBoundary>
      </ClientOnly>
    </div>
  );
}
