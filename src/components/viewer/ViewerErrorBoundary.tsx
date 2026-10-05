import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; label?: string };
type State = { error: Error | null };

/**
 * Keeps a failing 3D viewer (no WebGL, blocked model download, failed lazy
 * chunk) from taking down the whole page. Renders an inline notice instead.
 */
export class ViewerErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    console.error("3D viewer failed:", error);
  }

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-xs tracking-widest text-muted-foreground">
          3D VIEWER UNAVAILABLE ON THIS DEVICE
        </p>
        <p className="max-w-sm text-xs text-muted-foreground/80">
          {this.props.label ?? "The interactive model could not be displayed"} — this usually means
          hardware acceleration / WebGL is disabled in this browser, or the model file could not be
          downloaded. The rest of the page still works.
        </p>
        <button
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          onClick={() => this.setState({ error: null })}
        >
          Retry
        </button>
      </div>
    );
  }
}
