import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Label, TextArea } from "../components/ui";
import { cn } from "../utils/cn";

type DiffOp = { type: "equal" | "add" | "remove"; line: string };

function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "equal", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", line: a[i] });
      i++;
    } else {
      ops.push({ type: "add", line: b[j] });
      j++;
    }
  }
  while (i < n) {
    ops.push({ type: "remove", line: a[i] });
    i++;
  }
  while (j < m) {
    ops.push({ type: "add", line: b[j] });
    j++;
  }
  return ops;
}

export function DiffCheckerTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [original, setOriginal] = useState("Hello world\nThis is DevToolbox\nLine three");
  const [changed, setChanged] = useState("Hello there\nThis is DevToolbox\nLine three\nLine four");

  const ops = useMemo(() => diffLines(original.split("\n"), changed.split("\n")), [original, changed]);
  const additions = ops.filter((o) => o.type === "add").length;
  const removals = ops.filter((o) => o.type === "remove").length;
  const identical = additions === 0 && removals === 0;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>{tt("diff.original")}</Label>
          <TextArea rows={8} value={original} onChange={(e) => setOriginal(e.target.value)} />
        </div>
        <div>
          <Label>{tt("diff.changed")}</Label>
          <TextArea rows={8} value={changed} onChange={(e) => setChanged(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-emerald-600 dark:text-emerald-400">+{additions}</span>
        <span className="text-rose-600 dark:text-rose-400">-{removals}</span>
        <span className="text-slate-400">
          {additions + removals} {tt("diff.summary")}
        </span>
      </div>

      <div>
        <Label>{t.common.output}</Label>
        {identical ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {tt("diff.noDiff")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 font-mono text-sm dark:border-slate-800">
            {ops.map((op, idx) => (
              <div
                key={idx}
                className={cn(
                  "whitespace-pre-wrap break-words px-3 py-1",
                  op.type === "add" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                  op.type === "remove" && "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
                  op.type === "equal" && "bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                )}
              >
                <span className="mr-2 select-none text-slate-400">
                  {op.type === "add" ? "+" : op.type === "remove" ? "-" : " "}
                </span>
                {op.line || " "}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
