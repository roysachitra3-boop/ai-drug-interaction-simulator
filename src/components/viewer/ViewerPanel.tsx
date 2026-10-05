import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";

const MolecularViewer = lazy(() => import("./MolecularViewer"));

type Props = {
  drugUrl?: string | null | undefined;
  proteinUrl?: string | null | undefined;
  drugLabel?: string | undefined;
  proteinLabel?: string | undefined;
  active?: boolean | undefined;
  duration?: number | undefined;
  className?: string;
};


const Placeholder = () => (
  <div className="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card text-xs tracking-widest text-muted-foreground">
    INITIALISING 3D VIEWER…
  </div>
);

export function ViewerPanel({ className, ...props }: Props) {
  return (
    <div className={className}>
      <ClientOnly fallback={<Placeholder />}>
        <ViewerErrorBoundary label="The drug / protein interaction view could not be displayed">
          <Suspense fallback={<Placeholder />}>
            <MolecularViewer {...props} />
          </Suspense>
        </ViewerErrorBoundary>
      </ClientOnly>
    </div>
  );
}
