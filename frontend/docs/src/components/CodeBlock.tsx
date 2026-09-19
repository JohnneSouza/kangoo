import { useMemo, useState } from "react";
import { LANGS, type CodeSample } from "../data/types";
import { useLanguage } from "../context/LanguageContext";
import { highlight } from "../lib/highlight";
import { cn } from "../utils/cn";

interface CodeBlockProps {
  title?: string;
  code: CodeSample;
  response?: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-400">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M7 3.5A1.5 1.5 0 018.5 2h5A1.5 1.5 0 0115 3.5v9a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 017 13.5v-9z" />
            <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5V16h-1.5v.5h-7v-9H6V6H4.5z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function CodeBlock({ title, code, response }: CodeBlockProps) {
  const { lang, setLang } = useLanguage();
  const available = LANGS.filter((l) => code[l.id]);
  const active = code[lang] ? lang : available[0]?.id ?? "node";
  const snippet = code[active] ?? "";

  const highlighted = useMemo(() => highlight(snippet, active), [snippet, active]);
  const highlightedResponse = useMemo(
    () => (response ? highlight(response, "node") : ""),
    [response]
  );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-code-bg shadow-xl shadow-black/20 ring-1 ring-black/40">
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-code-bar px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {available.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1 text-2xs font-medium transition",
                active === l.id
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pl-2">
          {title && <span className="hidden text-2xs text-slate-500 sm:inline">{title}</span>}
          <CopyButton text={snippet} />
        </div>
      </div>
      <pre className="max-h-[420px] overflow-auto px-4 py-3.5 text-xs leading-relaxed">
        <code
          className="font-mono text-slate-200"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      {response && (
        <div className="border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 bg-code-bar px-4 py-1.5 text-2xs font-medium text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Response
          </div>
          <pre className="max-h-[320px] overflow-auto px-4 py-3.5 text-xs leading-relaxed">
            <code
              className="font-mono text-slate-200"
              dangerouslySetInnerHTML={{ __html: highlightedResponse }}
            />
          </pre>
        </div>
      )}
    </div>
  );
}
