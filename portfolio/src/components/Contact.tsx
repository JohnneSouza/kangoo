import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Contact</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Let's plan the next move together
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Have a role, project, or just want to talk backend architecture? My inbox is
            always open.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              { label: "Email", value: "daniel.reyes.dev@example.com", icon: "✉️", href: "mailto:daniel.reyes.dev@example.com" },
              { label: "Phone", value: "+1 (555) 214-7788", icon: "📞", href: "tel:+15552147788" },
              { label: "Location", value: "Austin, TX (Remote-friendly)", icon: "📍", href: undefined },
            ].map((info) => (
              <div
                key={info.label}
                className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-xl">
                  {info.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} className="font-medium text-slate-800 transition hover:text-accent dark:text-slate-100">
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-medium text-slate-800 dark:text-slate-100">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-4 text-sm text-slate-600 dark:text-slate-300">
              Currently open to senior backend and full-stack Java opportunities, remote or
              hybrid.
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                placeholder="Tell me about your project or role..."
                className="w-full resize-none rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-110 sm:w-auto"
            >
              Send message
            </button>
            {submitted && (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Thanks! Your message has been noted — I'll reply soon (this form is a demo).
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
