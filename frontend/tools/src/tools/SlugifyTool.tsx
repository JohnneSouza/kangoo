import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, Label, Select, TextArea, Toggle } from "../components/ui";

function slugify(input: string, separator: string, lowercase: boolean) {
  let value = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_-]+/g, separator);
  if (lowercase) value = value.toLowerCase();
  return value;
}

export function SlugifyTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [input, setInput] = useState(tt("slugify.placeholder"));
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);

  const output = useMemo(() => slugify(input, separator, lowercase), [input, separator, lowercase]);

  return (
    <>
      <div>
        <Label>{t.common.input}</Label>
        <TextArea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <Label>{tt("slugify.separator")}</Label>
          <Select value={separator} onChange={(e) => setSeparator(e.target.value)}>
            <option value="-">-</option>
            <option value="_">_</option>
            <option value=".">.</option>
          </Select>
        </div>
        <Toggle checked={lowercase} onChange={setLowercase} label={tt("slugify.lowercase")} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.output}</Label>
          <CopyButton value={output} />
        </div>
        <TextArea rows={3} value={output} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
      </div>
    </>
  );
}
