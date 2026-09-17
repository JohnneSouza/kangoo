const PROJECTS = [
  {
    title: "Chessly — Realtime Chess Platform",
    description:
      "A multiplayer chess platform with live matchmaking, move validation, and game history, built as a Spring Boot + WebSocket backend serving a React client.",
    tags: ["Spring Boot", "WebSocket", "PostgreSQL", "Redis"],
    emoji: "♟️",
    github: "https://github.com",
    demo: "#",
  },
  {
    title: "CubeCommerce Microservices",
    description:
      "An event-driven e-commerce backend split into order, inventory, and payment microservices communicating over Kafka, deployed on Kubernetes.",
    tags: ["Spring Cloud", "Kafka", "Docker", "Kubernetes"],
    emoji: "🧩",
    github: "https://github.com",
    demo: "#",
  },
  {
    title: "TaskForge REST API",
    description:
      "A production-grade task & project management API with JWT auth, role-based access control, pagination, and full OpenAPI documentation.",
    tags: ["Spring Security", "JWT", "MySQL", "Swagger"],
    emoji: "✅",
    github: "https://github.com",
    demo: "#",
  },
  {
    title: "Solve.io — Algorithm Visualizer API",
    description:
      "A Java service that solves and streams step-by-step solutions for puzzles like the Rubik's cube (Kociemba algorithm) and N-Queens back to a web client.",
    tags: ["Java", "Algorithms", "Spring Boot", "SSE"],
    emoji: "🧠",
    github: "https://github.com",
    demo: "#",
  },
  {
    title: "GrandmasterAnalytics",
    description:
      "A data pipeline that ingests chess.com/lichess game archives, computes player statistics, and exposes insights through a GraphQL API.",
    tags: ["GraphQL", "Batch Processing", "MongoDB", "AWS S3"],
    emoji: "📊",
    github: "https://github.com",
    demo: "#",
  },
  {
    title: "InventoryHub",
    description:
      "A warehouse inventory system with barcode scanning support, low-stock alerts, and a reporting dashboard, built on layered architecture with Hibernate.",
    tags: ["Hibernate", "Spring MVC", "PostgreSQL", "JUnit"],
    emoji: "📦",
    github: "https://github.com",
    demo: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Selected work</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Projects that ship, scale, and solve
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl dark:border-white/10 dark:bg-slate-900"
            >
              <div className="flex h-28 items-center justify-center bg-gradient-to-br from-accent/15 to-accent/5 text-4xl">
                <span className="transition-transform duration-300 group-hover:scale-110">{project.emoji}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-4 border-t border-black/5 pt-4 text-sm font-semibold dark:border-white/10">
                  <a href={project.github} target="_blank" rel="noreferrer" className="text-slate-600 transition hover:text-accent dark:text-slate-300">
                    Code →
                  </a>
                  <a href={project.demo} className="text-accent transition hover:brightness-110">
                    Live demo →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
