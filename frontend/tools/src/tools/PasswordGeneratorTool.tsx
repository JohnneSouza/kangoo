import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Button, CopyButton, Label, Toggle } from "../components/ui";
import { cn } from "../utils/cn";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "il1Lo0O";

export function PasswordGeneratorTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [length, setLength] = useState(20);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [seed, setSeed] = useState(0);

  const { password, error } = useMemo(() => {
    void seed;
    let charset = "";
    if (useUpper) charset += UPPER;
    if (useLower) charset += LOWER;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;
    if (excludeAmbiguous) {
      charset = charset
        .split("")
        .filter((c) => !AMBIGUOUS.includes(c))
        .join("");
    }
    if (!charset) return { password: "", error: tt("password.noCharset") };
    const values = crypto.getRandomValues(new Uint32Array(length));
    const result = Array.from(values, (v) => charset[v % charset.length]).join("");
    return { password: result, error: "" };
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, seed, tt]);

  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = [tt("password.weak"), tt("password.weak"), tt("password.fair"), tt("password.good"), tt("password.strong"), tt("password.strong")][
    strength
  ];
  const strengthColor = ["bg-rose-500", "bg-rose-500", "bg-amber-500", "bg-amber-400", "bg-emerald-500", "bg-emerald-500"][strength];

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <code className="break-all text-lg font-semibold text-slate-800 dark:text-slate-100">{password || "—"}</code>
          <div className="flex shrink-0 gap-1.5">
            <Button variant="ghost" onClick={() => setSeed((s) => s + 1)} type="button">
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <CopyButton value={password} />
          </div>
        </div>
        {password && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={cn("h-full rounded-full transition-all", strengthColor)}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{strengthLabel}</span>
          </div>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>
            {tt("password.length")}: {length}
          </Label>
        </div>
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Toggle checked={useUpper} onChange={setUseUpper} label={tt("password.uppercase")} />
        <Toggle checked={useLower} onChange={setUseLower} label={tt("password.lowercase")} />
        <Toggle checked={useNumbers} onChange={setUseNumbers} label={tt("password.numbers")} />
        <Toggle checked={useSymbols} onChange={setUseSymbols} label={tt("password.symbols")} />
        <Toggle checked={excludeAmbiguous} onChange={setExcludeAmbiguous} label={tt("password.excludeAmbiguous")} />
      </div>
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}
    </>
  );
}
