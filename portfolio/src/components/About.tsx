const STATS = [
  { label: "Years of experience", value: "6+" },
  { label: "Production services shipped", value: "30+" },
  { label: "Coffee-fueled deploys", value: "∞" },
  { label: "Certifications", value: "3" },
];

export default function About() {
  return (
    <section id="about" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">About me</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Turning coffee and logic into resilient backend systems
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              I'm a backend-focused <strong className="text-slate-900 dark:text-white">Java developer</strong> with
              over six years of experience designing APIs, services, and data pipelines that
              hold up under real-world load. I care about clean architecture, meaningful
              tests, and code that the next developer can actually understand.
            </p>
            <p>
              My day-to-day toolbox revolves around the <strong className="text-slate-900 dark:text-white">Spring
              ecosystem</strong>, relational and document databases, message queues, and
              containerized deployments. I enjoy breaking down ambiguous problems into
              small, provable steps — the same mindset I bring to a chessboard when
              calculating a few moves ahead, or to a Rubik's cube when working an algorithm
              layer by layer.
            </p>
            <p>
              Outside of shipping features, I mentor junior engineers, contribute to
              internal tooling, and like to speed-solve a Rubik's cube (personal best:
              41 seconds) between sprint planning sessions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
              >
                <p className="text-3xl font-extrabold text-accent">{s.value}</p>
                <p className="mt-1 text-xs font-medium leading-snug text-slate-500 dark:text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
