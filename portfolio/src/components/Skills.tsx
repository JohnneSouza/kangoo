const SKILL_GROUPS = [
  {
    title: "Core Language",
    icon: "☕",
    skills: ["Java 8–21", "Kotlin", "Multithreading", "Collections & Streams"],
  },
  {
    title: "Frameworks",
    icon: "🌱",
    skills: ["Spring Boot", "Spring MVC / WebFlux", "Spring Security", "Hibernate / JPA"],
  },
  {
    title: "Data & Messaging",
    icon: "🗄️",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Apache Kafka"],
  },
  {
    title: "DevOps & Cloud",
    icon: "☁️",
    skills: ["Docker", "Kubernetes", "AWS (EC2, S3, RDS)", "Jenkins / GitHub Actions"],
  },
  {
    title: "Testing & Quality",
    icon: "🧪",
    skills: ["JUnit 5", "Mockito", "Testcontainers", "SonarQube"],
  },
  {
    title: "Architecture",
    icon: "🧩",
    skills: ["REST & GraphQL APIs", "Microservices", "Event-driven design", "Design Patterns"],
  },
];

const PROFICIENCY = [
  { name: "Java / Spring Boot", value: 95 },
  { name: "SQL & Data Modeling", value: 88 },
  { name: "Microservices & APIs", value: 90 },
  { name: "Docker / Kubernetes", value: 80 },
  { name: "Testing & CI/CD", value: 85 },
];

export default function Skills() {
  return (
    <section id="skills" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Skills &amp; tools</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            The stack behind the strategy
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-lg">
                    {group.icon}
                  </span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{group.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h3 className="mb-5 font-semibold text-slate-900 dark:text-white">Proficiency levels</h3>
            <div className="space-y-5">
              {PROFICIENCY.map((p) => (
                <div key={p.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                    <span className="text-accent font-semibold">{p.value}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${p.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-xl border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">Fun fact</p>
              <p className="mt-1">
                I approach debugging like a chess endgame and refactors like solving a
                Rubik's cube — reduce the problem to a known pattern, then execute the
                algorithm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
