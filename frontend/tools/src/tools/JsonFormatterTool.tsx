import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Button, CopyButton, Label, Select, TextArea } from "../components/ui";
import { cn } from "../utils/cn";

export function JsonFormatterTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [input, setInput] = useState('{\n  "name": "DevToolbox",\n  "version": 1,\n  "tools": ["base64", "uuid", "json"],\n  "active": true\n}');
  const [indent, setIndent] = useState(2);
  const [output, setOutput] = useState("");

  const parsed = useMemo(() => {
    try {
      if (!input.trim()) return { ok: null as boolean | null, error: "" };
      JSON.parse(input);
      return { ok: true, error: "" };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }, [input]);

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, indent));
    } catch {
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
    } catch {
      setOutput("");
    }
  };

  return (
    <>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.input}</Label>
          {parsed.ok !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                parsed.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {parsed.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
              {parsed.ok ? tt("json.validJson") : tt("json.invalidJson")}
            </span>
          )}
        </div>
        <TextArea rows={12} value={input} placeholder={tt("json.placeholder")} onChange={(e) => setInput(e.target.value)} />
        {parsed.ok === false && (
          <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
            {parsed.error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={format} disabled={!parsed.ok}>
          {tt("json.format")}
        </Button>
        <Button variant="secondary" onClick={minify} disabled={!parsed.ok}>
          {tt("json.minify")}
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label>{tt("json.indentSize")}</Label>
          <Select value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </Select>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.output}</Label>
          <CopyButton value={output} />
        </div>
        <TextArea rows={12} value={output} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
      </div>
    </>
  );
}
