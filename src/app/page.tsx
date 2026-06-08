import {
  AlertTriangle,
  Archive,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Flame,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getProductionBrief, searchFilmAkb, askTela } from "@/lib/services/filmakb-service";

const navItems = ["Home", "Search", "Production", "Ask TELA", "Messages", "Profile"];

function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "risk" | "ready" }) {
  const toneClass = {
    neutral: "border-white/10 bg-white/10 text-zinc-200",
    risk: "border-amber-300/30 bg-amber-300/15 text-amber-100",
    ready: "border-emerald-300/30 bg-emerald-300/15 text-emerald-100",
  }[tone];

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>{label}</span>;
}

export default async function Home() {
  const brief = await getProductionBrief();
  const searchPreview = await searchFilmAkb("construction");
  const telaPreview = await askTela("What is blocking Day 4?");

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#09090b]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-red-600">
              <Flame className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">ShowTELA Prep</p>
              <h1 className="text-lg font-semibold">{brief.production.title}</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                className="rounded-md px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section id="home" className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#18181b_0%,#09090b_45%,#3f0d0d_100%)] p-6 shadow-2xl shadow-black/40 md:p-10">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              <StatusPill label="Prep" tone="ready" />
              <StatusPill label={`${brief.readiness}% readiness`} />
              <StatusPill label={`${brief.risks.length} open risks`} tone="risk" />
            </div>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-red-200">Production Overview</p>
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">{brief.production.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">{brief.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-md bg-white px-4 py-3 text-sm font-semibold text-zinc-950" href="#production-brief">
                Open Production Brief
              </a>
              <a className="rounded-md border border-white/15 px-4 py-3 text-sm font-semibold text-white" href="#ask-tela">
                Ask TELA
              </a>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-zinc-950 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Morning Brief</h3>
            <CalendarDays className="size-5 text-zinc-500" />
          </div>
          <p className="mt-4 text-2xl font-semibold">Good Morning Jon</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Today&apos;s priority is to upload the script artifact so FilmAKB can generate scenes, characters, locations, and the first authoritative production brief.
          </p>
          <div className="mt-5 space-y-3">
            {["Upload script", "Generate registries", "Resolve Day 4 blockers"].map((item) => (
              <div className="flex items-center gap-3 rounded-md bg-white/[0.04] p-3" key={item}>
                <Clock className="size-4 text-red-300" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 lg:grid-cols-[0.85fr_1.15fr]">
        <div id="production-brief" className="rounded-lg border border-white/10 bg-zinc-950 p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Production Brief</h3>
            <ShieldCheck className="size-5 text-emerald-300" />
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Where are we?</p>
          <p className="mt-3 text-lg leading-7 text-zinc-200">{brief.summary}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md bg-white/[0.04] p-4">
              <p className="text-3xl font-semibold">{brief.readiness}%</p>
              <p className="mt-1 text-sm text-zinc-500">Readiness</p>
            </div>
            <div className="rounded-md bg-white/[0.04] p-4">
              <p className="text-3xl font-semibold">{brief.decisions.length}</p>
              <p className="mt-1 text-sm text-zinc-500">Decisions</p>
            </div>
            <div className="rounded-md bg-white/[0.04] p-4">
              <p className="text-3xl font-semibold">{brief.assumptions.length}</p>
              <p className="mt-1 text-sm text-zinc-500">Assumptions</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {brief.risks.map((risk) => (
              <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4" key={risk.id}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 text-amber-200" />
                  <div>
                    <p className="font-medium text-amber-50">{risk.title}</p>
                    <p className="mt-1 text-sm text-amber-100/75">{risk.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <section id="search" className="rounded-lg border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <Search className="size-5 text-zinc-400" />
              <h3 className="text-xl font-semibold">Search Finds</h3>
            </div>
            <div className="mt-4 rounded-md border border-white/10 bg-black px-4 py-3 text-zinc-400">
              construction
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {searchPreview.results.map((result) => (
                <article className="rounded-md bg-white/[0.04] p-4" key={result.id}>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{result.type}</p>
                  <h4 className="mt-2 font-semibold">{result.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{result.excerpt}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="ask-tela" className="rounded-lg border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-red-300" />
              <h3 className="text-xl font-semibold">Ask TELA Understands</h3>
            </div>
            <p className="mt-4 rounded-md border border-white/10 bg-black px-4 py-3 text-zinc-300">
              What is blocking Day 4?
            </p>
            <p className="mt-4 text-lg font-semibold">{telaPreview.answer}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {telaPreview.recommendedActions.map((action) => (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-100" key={action}>{action}</div>
              ))}
            </div>
            <p className="mt-4 text-sm text-emerald-200">{telaPreview.readinessImpact}</p>
          </section>
        </div>

        <section id="production" className="rounded-lg border border-white/10 bg-zinc-950 p-5 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["Artifact Library", "Files, OCR, versions, relationships", Archive],
              ["Location Detail", "Permits, maps, photos, schedule", MapPin],
              ["Scene Detail", "Dependencies, risks, characters", FileText],
              ["Production Replay", "Why, when, who, what changed", MessageSquare],
            ].map(([title, body, Icon]) => (
              <article className="rounded-md bg-white/[0.04] p-4" key={title as string}>
                <Icon className="size-5 text-zinc-400" />
                <h4 className="mt-4 font-semibold">{title as string}</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{body as string}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-zinc-950 p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-5 text-emerald-300" />
            <h3 className="text-xl font-semibold">TELAwhy Verifies</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-400">{brief.telawhy.summary}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {brief.telawhy.evidence.map((item) => (
              <div className="rounded-md border border-white/10 p-3 text-sm text-zinc-300" key={item}>{item}</div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
