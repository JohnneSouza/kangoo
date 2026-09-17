const EDUCATION = [
  {
    title: "B.Sc. in Computer Science",
    place: "University of Lakeview",
    period: "2013 — 2017",
    icon: "🎓",
  },
];

const CERTIFICATIONS = [
  { title: "Oracle Certified Professional: Java SE 17 Developer", year: "2023", icon: "☕" },
  { title: "AWS Certified Developer – Associate", year: "2022", icon: "☁️" },
  { title: "Certified Kubernetes Application Developer (CKAD)", year: "2023", icon: "⚙️" },
];

export default function Education() {
  return (
    <section id="education" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Education &amp; certifications</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Studying the rules before mastering the game
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Education</h3>
            <div className="space-y-4">
              {EDUCATION.map((e) => (
                <div key={e.title} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl">
                    {e.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{e.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{e.place}</p>
                    <p className="text-xs font-medium text-accent">{e.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Certifications</h3>
            <div className="space-y-4">
              {CERTIFICATIONS.map((c) => (
                <div key={c.title} className="flex items-start gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl">
                    {c.icon}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{c.title}</p>
                    <p className="text-xs font-medium text-accent">{c.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
