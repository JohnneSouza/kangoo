import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Button, CopyButton, Label, TextInput } from "../components/ui";

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 19);
}

export function TimestampConverterTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [date, setDate] = useState(() => new Date());
  const [error, setError] = useState("");

  const seconds = Math.floor(date.getTime() / 1000);
  const millis = date.getTime();

  const relative = useMemo(() => {
    const diffMs = date.getTime() - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const abs = Math.abs(diffSec);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    if (abs < 60) return rtf.format(diffSec, "second");
    if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
    return rtf.format(Math.round(diffSec / 86400), "day");
  }, [date, locale]);

  const setFromSeconds = (val: string) => {
    const n = Number(val);
    if (val.trim() === "" || Number.isNaN(n)) {
      setError(tt("timestamp.invalid"));
      return;
    }
    setError("");
    setDate(new Date(n * 1000));
  };

  const setFromMillis = (val: string) => {
    const n = Number(val);
    if (val.trim() === "" || Number.isNaN(n)) {
      setError(tt("timestamp.invalid"));
      return;
    }
    setError("");
    setDate(new Date(n));
  };

  const setFromIso = (val: string) => {
    const parsed = new Date(val);
    if (Number.isNaN(parsed.getTime())) {
      setError(tt("timestamp.invalid"));
      return;
    }
    setError("");
    setDate(parsed);
  };

  const setFromLocal = (val: string) => {
    const parsed = new Date(val);
    if (Number.isNaN(parsed.getTime())) {
      setError(tt("timestamp.invalid"));
      return;
    }
    setError("");
    setDate(parsed);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <span className="text-sm text-slate-500 dark:text-slate-400">{tt("timestamp.relative")}: <strong className="text-slate-700 dark:text-slate-200">{relative}</strong></span>
        <Button variant="secondary" onClick={() => setDate(new Date())}>
          {tt("timestamp.now")}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("timestamp.unixSeconds")}</Label>
            <CopyButton value={String(seconds)} />
          </div>
          <TextInput value={seconds} onChange={(e) => setFromSeconds(e.target.value)} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("timestamp.unixMillis")}</Label>
            <CopyButton value={String(millis)} />
          </div>
          <TextInput value={millis} onChange={(e) => setFromMillis(e.target.value)} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("timestamp.iso")}</Label>
            <CopyButton value={date.toISOString()} />
          </div>
          <TextInput value={date.toISOString()} onChange={(e) => setFromIso(e.target.value)} />
        </div>
        <div>
          <Label>{tt("timestamp.local")}</Label>
          <TextInput type="datetime-local" step="1" value={toLocalInputValue(date)} onChange={(e) => setFromLocal(e.target.value)} />
        </div>
      </div>
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}
    </>
  );
}
