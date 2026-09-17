import { useThemeContext } from "../context/ThemeContext";

const CODE_SNIPPET = `public class Developer implements Problem­Solver {

    private final Set<String> stack = Set.of(
        "Java", "Spring Boot", "Kafka", "Docker"
    );

    @Override
    public Solution solve(Problem problem) {
        return stack.stream()
            .map(problem::applyTool)
            .reduce(Solution::combine)
            .orElseThrow();
    }
}`;

export default function Hero() {
  const { themeStyle } = useThemeContext();

  return (
    <section id="top" className="relative overflow-hidden px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Available for backend roles
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Hi, I'm <span className="text-accent">Daniel Reyes</span>
            <br />
            Java Backend Developer
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            I design and build reliable, scalable server-side systems with the Java
            ecosystem — Spring Boot, microservices, and clean architecture — with the
            same discipline it takes to plan a winning chess move or solve a Rubik's
            cube: one logical step at a time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(var(--accent-rgb),0.35)] transition hover:brightness-110"
            >
              View my projects
            </a>
            <a
              href="#contact"
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-accent hover:text-accent dark:border-white/15 dark:bg-slate-900 dark:text-slate-200"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-9 flex items-center gap-5">
            {[
              { label: "GitHub", href: "https://github.com", icon: "M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 007.86 10.94c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.08.78 2.17v3.22c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" },
              { label: "LinkedIn", href: "https://linkedin.com", icon: "M6.94 5a2 2 0 11-4-.01 2 2 0 014 .01zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-3.96 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.68-2.91V8.48z" },
              { label: "Email", href: "mailto:daniel.reyes.dev@example.com", icon: "M1.5 4.5h21v15h-21v-15zm1.7 1.7 8.8 6.4 8.8-6.4M2 6.1v13h20V6.1" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent/20 blur-3xl" />
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-slate-900">
            <img
              src="/images/avatar.png"
              alt="Illustration of a Java developer at a desk with a laptop, a chessboard and a Rubik's cube"
              className="h-56 w-full object-cover sm:h-64"
            />
            <div className="space-y-2 bg-slate-950 p-5 font-mono text-[11px] leading-relaxed text-slate-200 sm:text-xs">
              <div className="mb-2 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-2 text-slate-500">Developer.java</span>
              </div>
              <pre className="overflow-x-auto whitespace-pre text-slate-300">
                <code>{CODE_SNIPPET}</code>
              </pre>
            </div>
          </div>

          {themeStyle === "chess" ? (
            <div className="chess-divider mx-auto mt-6 w-2/3" />
          ) : (
            <div className="rubik-divider mx-auto mt-6 w-2/3" />
          )}
        </div>
      </div>
    </section>
  );
}
