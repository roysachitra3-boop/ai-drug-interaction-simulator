import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ViewerErrorBoundary } from "./ViewerErrorBoundary";

const SingleModelViewer = lazy(() => import("./SingleModelViewer"));

type Props = {
  url: string;
  label?: string | undefined;
  className?: string;
};

const Placeholder = () => (
  <div className="flex h-full w-full items-center justify-center rounded-xl border border-border bg-card text-xs tracking-widest text-muted-foreground">
    INITIALISING 3D VIEWER…
  </div>
);

export function SingleViewerPanel({ className, ...props }: Props) {
  return (
    <div className={className}>
      <ClientOnly fallback={<Placeholder />}>
        <ViewerErrorBoundary label="This model could not be displayed">
          <Suspense fallback={<Placeholder />}>
            <SingleModelViewer {...props} />
          </Suspense>
        </ViewerErrorBoundary>
      </ClientOnly>
    </div>
  );
}
