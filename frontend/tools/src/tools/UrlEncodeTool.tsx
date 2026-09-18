import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, ErrorText, Label, TextArea } from "../components/ui";

export function UrlEncodeTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [variant, setVariant] = useState<"component" | "full">("component");
  const [input, setInput] = useState("https://example.com/search?q=café & code#top");

  const { output, error } = useMemo(() => {
    try {
      if (!input) return { output: "", error: "" };
      if (mode === "encode") {
        return { output: variant === "component" ? encodeURIComponent(input) : encodeURI(input), error: "" };
      }
      return { output: variant === "component" ? decodeURIComponent(input) : decodeURI(input), error: "" };
    } catch {
      return { output: "", error: tt("urlEncode.invalid") };
    }
  }, [input, mode, variant, tt]);

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output || input);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
                mode === m
                  ? "bg-white text-violet-700 shadow-sm dark:bg-slate-700 dark:text-violet-300"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {m === "encode" ? t.common.encode : t.common.decode}
            </button>
          ))}
        </div>
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as "component" | "full")}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="component">{tt("urlEncode.component")}</option>
          <option value="full">{tt("urlEncode.full")}</option>
        </select>
        <button
          onClick={swap}
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {t.common.swap}
        </button>
      </div>

      <div>
        <Label>{t.common.input}</Label>
        <TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.output}</Label>
          <CopyButton value={output} />
        </div>
        <TextArea rows={6} value={output} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
        <ErrorText>{error}</ErrorText>
      </div>
    </>
  );
}
