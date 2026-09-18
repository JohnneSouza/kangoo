import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useToolStrings } from "../i18n/toolStrings";
import { useI18n } from "../i18n/I18nContext";
import { Label, TextArea } from "../components/ui";

const DEFAULT_MD = `# DevToolbox

A collection of **developer tools** for everyday tasks.

## Features

- Base64 encode / decode
- UUID generation
- JSON formatting

> Everything runs locally in your browser.

\`\`\`js
console.log("Hello, DevToolbox!");
\`\`\`

[Learn more](https://example.com)
`;

marked.setOptions({ breaks: true, gfm: true });

export function MarkdownPreviewTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [markdown, setMarkdown] = useState(DEFAULT_MD);

  const html = useMemo(() => {
    const raw = marked.parse(markdown, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <Label>{tt("markdown.editor")}</Label>
        <TextArea
          rows={20}
          value={markdown}
          placeholder={tt("markdown.placeholder")}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>
      <div>
        <Label>{tt("markdown.preview")}</Label>
        <div
          className="prose prose-sm h-[calc(100%-1.5rem)] min-h-[28rem] max-w-none overflow-auto rounded-lg border border-slate-200 bg-white p-4 dark:prose-invert dark:border-slate-700 dark:bg-slate-900"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
