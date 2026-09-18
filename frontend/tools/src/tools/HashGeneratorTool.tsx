import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, Label, Select, TextArea } from "../components/ui";
import { md5 } from "../utils/md5";

const ALGORITHMS = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

async function digestHex(algorithm: string, text: string) {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashGeneratorTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [algorithm, setAlgorithm] = useState<(typeof ALGORITHMS)[number]>("SHA-256");
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const results: Record<string, string> = {};
      results.MD5 = input ? md5(input) : "";
      for (const algo of ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const) {
        results[algo] = input ? await digestHex(algo, input) : "";
      }
      if (!cancelled) setHashes(results);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <>
      <div>
        <Label>{t.common.input}</Label>
        <TextArea rows={5} value={input} placeholder={tt("hash.placeholder")} onChange={(e) => setInput(e.target.value)} />
      </div>

      <div className="max-w-xs">
        <Label>{tt("hash.algorithm")}</Label>
        <Select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as typeof algorithm)} className="w-full">
          {ALGORITHMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-3">
        {ALGORITHMS.map((algo) => (
          <div key={algo} className={algo === algorithm ? "" : "opacity-60"}>
            <div className="mb-1.5 flex items-center justify-between">
              <Label>{algo}</Label>
              <CopyButton value={hashes[algo] ?? ""} />
            </div>
            <div className="break-all rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
              {hashes[algo] || "—"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
