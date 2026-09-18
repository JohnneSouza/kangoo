import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Button, CopyButton, Label, TextArea, TextInput, Toggle } from "../components/ui";

function generateUuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function UuidGeneratorTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [seed, setSeed] = useState(0);

  const uuids = useMemo(() => {
    void seed;
    const count = Math.min(Math.max(quantity, 1), 200);
    return Array.from({ length: count }, () => {
      let value = generateUuid();
      if (!hyphens) value = value.replace(/-/g, "");
      if (uppercase) value = value.toUpperCase();
      if (braces) value = `{${value}}`;
      return value;
    });
  }, [quantity, uppercase, hyphens, braces, seed]);

  const output = uuids.join("\n");

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Label>{tt("uuid.quantity")}</Label>
          <TextInput
            type="number"
            min={1}
            max={200}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
        </div>
        <div className="col-span-2 flex flex-wrap items-center gap-4 sm:col-span-3 sm:justify-start">
          <Toggle checked={uppercase} onChange={setUppercase} label={tt("uuid.uppercase")} />
          <Toggle checked={hyphens} onChange={setHyphens} label={tt("uuid.hyphens")} />
          <Toggle checked={braces} onChange={setBraces} label={tt("uuid.braces")} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={() => setSeed((s) => s + 1)}>
          <RefreshCw className="h-3.5 w-3.5" />
          {tt("uuid.generate")}
        </Button>
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
