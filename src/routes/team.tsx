import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, GraduationCap, Workflow, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MEMBERS,
  MENTORS,
  WORKFLOW,
  FOCUS_AREAS,
  TEAM_ABOUT,
  TEAM_MOTTO,
  TEAM_SCHOOL,
  TEAM_TAGLINE,
} from "@/data/teamAlpha";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team Alpha — Members & Mentors" },
      {
        name: "description",
        content:
          "Team Alpha: a student technology and innovation team of Class 7, Shatadal Section — members, mentors, focus areas and workflow.",
      },
      { property: "og:title", content: "Team Alpha — Members & Mentors" },
      {
        property: "og:description",
        content: "Meet the 11 students and mentors behind Team Alpha's AI and technology projects.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <main className="surface-hero min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/">
            <ArrowLeft className="mr-1.5 size-4" /> Home
          </Link>
        </Button>

        <header className="mt-4">
          <span className="label-mono text-accent">Team Database</span>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Team <span className="text-primary">Alpha</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{TEAM_TAGLINE}</p>
          <p className="mt-1 text-sm text-muted-foreground">{TEAM_SCHOOL}</p>
        </header>

        <section className="panel mt-8 p-6">
          <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {TEAM_ABOUT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-5 font-display text-lg text-primary">“{TEAM_MOTTO}”</p>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <Users className="size-5 text-primary" /> Members
            <span className="label-mono ml-1 text-muted-foreground">{MEMBERS.length}</span>
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERS.map((m) => (
              <article key={m.name} className="panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold leading-snug">{m.name}</h3>
                  {m.code && (
                    <span className="label-mono shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-primary">
                      {m.code}
                    </span>
                  )}
                </div>
                {m.note && <p className="mt-3 text-sm text-muted-foreground">{m.note}</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Workflow className="size-5 text-accent" /> Working method
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {WORKFLOW.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm">
                    {step}
                  </span>
                  {i < WORKFLOW.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles className="size-5 text-accent" /> Focus areas
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {FOCUS_AREAS.map((f) => (
                <span
                  key={f}
                  className="label-mono rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-semibold">
            <GraduationCap className="size-5 text-primary" /> Mentors & Faculty
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENTORS.map((m) => (
              <div key={m.name} className="panel px-5 py-4">
                <p className="font-medium">{m.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
