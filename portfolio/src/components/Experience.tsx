const EXPERIENCE = [
  {
    role: "Senior Java Developer",
    company: "NexaFin Technologies",
    period: "2022 — Present",
    points: [
      "Led migration of a monolithic payments platform to Spring Boot microservices, cutting deployment time by 70%.",
      "Designed event-driven order processing with Kafka, handling 2M+ messages/day at 99.98% uptime.",
      "Mentored a team of 5 engineers and introduced code-review standards adopted org-wide.",
    ],
  },
  {
    role: "Java Backend Developer",
    company: "Northwind Logistics",
    period: "2019 — 2022",
    points: [
      "Built REST APIs powering a fleet-tracking dashboard used by 10k+ daily drivers.",
      "Optimized PostgreSQL queries and added Redis caching, reducing average response time by 45%.",
      "Implemented CI/CD pipelines with Jenkins and Docker, enabling multiple daily releases.",
    ],
  },
  {
    role: "Software Engineer (Java)",
    company: "BrightPath Software",
    period: "2017 — 2019",
    points: [
      "Developed and maintained internal tooling with Spring MVC and Hibernate.",
      "Wrote comprehensive JUnit test suites, raising code coverage from 40% to 85%.",
      "Collaborated with QA to reduce production incidents by 30% quarter over quarter.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Experience</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            A track record of steady, calculated moves
          </h2>
        </div>

        <div className="relative border-l-2 border-accent/25 pl-8 sm:pl-10">
          {EXPERIENCE.map((job, idx) => (
            <div key={job.role} className={`relative ${idx !== EXPERIENCE.length - 1 ? "mb-10" : ""}`}>
              <span className="absolute -left-[41px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-accent shadow-md dark:border-slate-950 sm:-left-[49px]" />
              <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.role}</h3>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{job.company}</p>
                <ul className="mt-4 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
