import type { Block, DocPage as DocPageType } from "../data/types";
import CodeBlock from "./CodeBlock";
import { cn } from "../utils/cn";

function Callout({ variant, text }: { variant: "info" | "warning" | "success"; text: string }) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
  }[variant];
  const icon = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✅",
  }[variant];
  return (
    <div className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed", styles)}>
      <span className="mt-0.5">{icon}</span>
      <p>{text}</p>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-surface-muted">
            {headers.map((h) => (
              <th key={h} className="border-b border-line px-3.5 py-2 font-semibold text-fg-body">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line-soft last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3.5 py-2 align-top text-fg-body">
                  {j === 0 ? <code className="rounded-sm bg-surface-strong px-1.5 py-0.5 text-xs text-brand-soft-fg">{cell}</code> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded-sm bg-brand-soft px-1.5 py-0.5 font-mono text-xs text-brand-soft-fg">
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function TextBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? (
        <h3 id={block.id} className="scroll-mt-24 pt-2 text-base font-semibold tracking-tight text-fg">
          {block.text}
        </h3>
      ) : (
        <h2 id={block.id} className="scroll-mt-24 border-t border-line-soft pt-8 text-xl font-semibold tracking-tight text-fg first:border-0 first:pt-0">
          {block.text}
        </h2>
      );
    case "paragraph":
      return <p className="text-md leading-relaxed text-fg-body">{renderInlineCode(block.text)}</p>;
    case "list":
      return block.ordered ? (
        <ol className="list-decimal space-y-1.5 pl-5 text-md leading-relaxed text-fg-body">
          {block.items.map((item, i) => (
            <li key={i}>{renderInlineCode(item)}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc space-y-1.5 pl-5 text-md leading-relaxed text-fg-body">
          {block.items.map((item, i) => (
            <li key={i}>{renderInlineCode(item)}</li>
          ))}
        </ul>
      );
    case "table":
      return <Table headers={block.headers} rows={block.rows} />;
    case "callout":
      return <Callout variant={block.variant} text={block.text} />;
    default:
      return null;
  }
}

export default function DocPage({ page }: { page: DocPageType }) {
  const textBlocks = page.blocks.filter((b) => b.type !== "code");
  const codeBlocks = page.blocks.filter((b) => b.type === "code") as Extract<Block, { type: "code" }>[];
  const headings = page.blocks.filter((b) => b.type === "heading") as Extract<Block, { type: "heading" }>[];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10">
      <div className="mb-2 text-2xs font-semibold uppercase tracking-wider text-link">
        {page.group}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{page.title}</h1>
      <p className="mt-2 max-w-2xl text-md leading-relaxed text-fg-muted">{page.description}</p>

      {headings.length > 2 && (
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 rounded-lg border border-line-soft bg-surface-muted/60 px-4 py-3 text-xs">
          <span className="font-semibold text-fg-subtle">On this page:</span>
          {headings.map((h) => (
            <a key={h.id} href={`#${h.id}`} className="text-link hover:underline">
              {h.text}
            </a>
          ))}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-8 xl:grid-cols-[minmax(0,1fr)_460px]">
        <div className="space-y-5">
          {textBlocks.map((block, i) => (
            <TextBlock key={i} block={block} />
          ))}
        </div>

        {codeBlocks.length > 0 && (
          <div className="space-y-6 xl:sticky xl:top-20 xl:h-fit">
            {codeBlocks.map((block, i) => (
              <CodeBlock key={i} title={block.title} code={block.code} response={block.response} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
