import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Label, TextInput } from "../components/ui";

type Base = 2 | 8 | 10 | 16;

const BASE_PATTERN: Record<Base, RegExp> = {
  2: /^[01]*$/,
  8: /^[0-7]*$/,
  10: /^[0-9]*$/,
  16: /^[0-9a-fA-F]*$/,
};

export function NumberBaseTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [decimalValue, setDecimalValue] = useState<bigint | null>(42n);
  const [fields, setFields] = useState<Record<Base, string>>({ 2: "101010", 8: "52", 10: "42", 16: "2a" });
  const [error, setError] = useState("");

  const bases: { base: Base; label: string; prefix: string }[] = [
    { base: 10, label: tt("numberBase.decimal"), prefix: "" },
    { base: 2, label: tt("numberBase.binary"), prefix: "0b" },
    { base: 8, label: tt("numberBase.octal"), prefix: "0o" },
    { base: 16, label: tt("numberBase.hex"), prefix: "0x" },
  ];

  const handleChange = (base: Base, raw: string) => {
    const cleaned = raw.trim();
    if (!BASE_PATTERN[base].test(cleaned)) {
      setError(tt("numberBase.invalid"));
      setFields((prev) => ({ ...prev, [base]: raw }));
      return;
    }
    setError("");
    if (cleaned === "") {
      setDecimalValue(null);
      setFields({ 2: "", 8: "", 10: "", 16: "" });
      return;
    }
    try {
      const value = BigInt(base === 10 ? cleaned : `0${base === 2 ? "b" : base === 8 ? "o" : "x"}${cleaned}`);
      setDecimalValue(value);
      setFields({
        2: value.toString(2),
        8: value.toString(8),
        10: value.toString(10),
        16: value.toString(16),
      });
    } catch {
      setError(tt("numberBase.invalid"));
    }
  };

  useMemo(() => decimalValue, [decimalValue]);

  return (
    <>
      <div className="space-y-4">
        {bases.map(({ base, label, prefix }) => (
          <div key={base}>
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
              {prefix && <span className="font-mono text-sm text-slate-400">{prefix}</span>}
              <TextInput
                value={fields[base]}
                onChange={(e) => handleChange(base, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}
    </>
  );
}
