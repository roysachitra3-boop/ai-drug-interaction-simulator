import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/alphamedi")({
  head: () => ({
    meta: [
      { title: "Alpha Medi" },
      {
        name: "description",
        content: "Redirecting to Alpha Medi.",
      },
      { property: "og:title", content: "Alpha Medi" },
      {
        property: "og:description",
        content: "Redirecting to Alpha Medi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AlphaMediRedirect,
});

function AlphaMediRedirect() {
  useEffect(() => {
    window.location.href = "https://alpha-care-guide.lovable.app/";
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Opening Alpha Medi…</p>
    </main>
  );
}
