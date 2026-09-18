import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, ErrorText, Label, TextArea, Toggle } from "../components/ui";
import { ArrowUpDown } from "lucide-react";

function toBase64(input: string, urlSafe: boolean) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  let out = btoa(binary);
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

function fromBase64(input: string) {
  const normalized = input.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool() {
  const { t } = useI18n();
  const tt = useToolStrings(useI18n().locale);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, world! 👋");
  const [urlSafe, setUrlSafe] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      if (!input) return { output: "", error: "" };
      const result = mode === "encode" ? toBase64(input, urlSafe) : fromBase64(input);
      return { output: result, error: "" };
    } catch {
      return { output: "", error: tt("base64.invalid") };
    }
  }, [input, mode, urlSafe, tt]);

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
        <Toggle checked={urlSafe} onChange={setUrlSafe} label={tt("base64.urlSafe")} />
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
        <TextArea
          rows={7}
          value={input}
          placeholder={tt("base64.placeholder")}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.output}</Label>
          <CopyButton value={output} />
        </div>
        <TextArea rows={7} value={output} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
        <ErrorText>{error}</ErrorText>
      </div>
    </>
  );
}
