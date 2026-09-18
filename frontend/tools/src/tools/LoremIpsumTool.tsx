import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, Label, Select, TextArea, TextInput, Toggle } from "../components/ui";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " "
  );

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeSentence(minWords = 6, maxWords = 16): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
  const words = Array.from({ length: len }, () => pick(WORDS));
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function makeParagraph(sentences = 5): string {
  return Array.from({ length: sentences }, () => makeSentence()).join(" ");
}

export function LoremIpsumTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(4);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    void seed;
    const n = Math.min(Math.max(count, 1), 200);
    let result = "";
    if (unit === "words") {
      const words = Array.from({ length: n }, () => pick(WORDS));
      result = words.join(" ");
    } else if (unit === "sentences") {
      result = Array.from({ length: n }, () => makeSentence()).join(" ");
    } else {
      result = Array.from({ length: n }, () => makeParagraph()).join("\n\n");
    }
    if (startWithLorem) {
      const prefix = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
      if (unit === "paragraphs") {
        const rest = result.split("\n\n").slice(1);
        result = [prefix + ". " + makeSentence(), ...rest].join("\n\n");
      } else if (unit === "sentences") {
        const rest = result.split(". ").slice(1).join(". ");
        result = prefix + ". " + rest;
      } else {
        const rest = result.split(" ").slice(6).join(" ");
        result = "Lorem ipsum dolor sit amet " + rest;
      }
    }
    return result;
  }, [unit, count, startWithLorem, seed]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label>{tt("lorem.unit")}</Label>
          <Select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} className="w-full">
            <option value="paragraphs">{tt("lorem.paragraphs")}</option>
            <option value="sentences">{tt("lorem.sentences")}</option>
            <option value="words">{tt("lorem.words")}</option>
          </Select>
        </div>
        <div>
          <Label>{tt("lorem.count")}</Label>
          <TextInput type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value) || 1)} />
        </div>
        <div className="flex items-end pb-2">
          <Toggle checked={startWithLorem} onChange={setStartWithLorem} label={tt("lorem.startWithLorem")} />
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <Label>{t.common.output}</Label>
          <div className="flex gap-2">
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="text-sm font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400"
            >
              {t.common.sample}
            </button>
            <CopyButton value={output} />
          </div>
        </div>
        <TextArea rows={14} value={output} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
      </div>
    </>
  );
}
