import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { CopyButton, Label, TextArea } from "../components/ui";
import { caseConverters } from "../utils/textCase";

export function CaseConverterTool() {
  const { t } = useI18n();
  const [input, setInput] = useState("Hello World, this is DevToolbox!");

  const results = useMemo(
    () => Object.entries(caseConverters).map(([label, fn]) => ({ label, value: fn(input) })),
    [input]
  );

  return (
    <>
      <div>
        <Label>{t.common.input}</Label>
        <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {results.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <CopyButton value={value} />
            </div>
            <p className="break-all font-mono text-sm text-slate-800 dark:text-slate-200">{value || "—"}</p>
          </div>
        ))}
      </div>
    </>
  );
}
