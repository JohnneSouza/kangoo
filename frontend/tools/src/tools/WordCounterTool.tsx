import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { Label, TextArea } from "../components/ui";

export function WordCounterTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [text, setText] = useState(
    "Type or paste any text here to instantly see word count, character count, sentence count and estimated reading time."
  );

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\n/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) ?? []).length || (trimmed ? 1 : 0) : 0;
    const readingMinutes = Math.max(1, Math.round(words / 200));
    return { words, characters, charactersNoSpaces, lines, sentences, readingMinutes };
  }, [text]);

  const cards = [
    { label: t.common.wordsLabel, value: stats.words },
    { label: t.common.charactersLabel, value: stats.characters },
    { label: tt("wordCounter.sentences"), value: stats.sentences },
    { label: t.common.linesLabel, value: stats.lines },
  ];

  return (
    <>
      <div>
        <Label>{t.common.input}</Label>
        <TextArea
          rows={12}
          value={text}
          placeholder={tt("wordCounter.placeholder")}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-800">
            <div className="text-2xl font-semibold text-violet-600 dark:text-violet-400">{c.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
        {tt("wordCounter.readingTime")}: <strong>{stats.readingMinutes} {tt("wordCounter.minutes")}</strong>
      </div>
    </>
  );
}
