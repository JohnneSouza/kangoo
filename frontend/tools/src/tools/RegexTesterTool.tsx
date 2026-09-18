import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Label, TextArea, TextInput } from "../components/ui";

export function RegexTesterTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [pattern, setPattern] = useState("[a-z]+@[a-z]+\\.[a-z]{2,}");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or support@devtoolbox.io for help.");

  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[], error: "", highlighted: text };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const found = Array.from(text.matchAll(re));
      let cursor = 0;
      const parts: string[] = [];
      found.forEach((m) => {
        const start = m.index ?? 0;
        parts.push(escapeHtml(text.slice(cursor, start)));
        parts.push(`<mark class="rounded bg-amber-200 px-0.5 dark:bg-amber-500/40">${escapeHtml(m[0])}</mark>`);
        cursor = start + m[0].length;
      });
      parts.push(escapeHtml(text.slice(cursor)));
      return { matches: found, error: "", highlighted: parts.join("") };
    } catch (err) {
      return { matches: [], error: err instanceof Error ? err.message : tt("regex.invalid"), highlighted: text };
    }
  }, [pattern, flags, text, tt]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
        <div>
          <Label>{tt("regex.pattern")}</Label>
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-950">
            <span className="text-slate-400">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className="w-full bg-transparent px-1 py-2 font-mono text-sm text-slate-900 outline-none dark:text-slate-100"
            />
            <span className="text-slate-400">/{flags}</span>
          </div>
        </div>
        <div>
          <Label>{tt("regex.flags")}</Label>
          <TextInput value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}

      <div>
        <Label>{tt("regex.testString")}</Label>
        <TextArea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>
            {matches.length} {tt("regex.matches")}
          </Label>
        </div>
        <div
          className="min-h-[3rem] whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          dangerouslySetInnerHTML={{ __html: highlighted || `<span class="text-slate-400">${tt("regex.noMatches")}</span>` }}
        />
      </div>
    </>
  );
}

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
