export type Lang = "curl" | "node" | "python" | "ruby" | "php";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "node", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
];

export type CodeSample = Partial<Record<Lang, string>>;

export type Block =
  | { type: "heading"; level?: 2 | 3; text: string; id: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | {
      type: "code";
      title?: string;
      code: CodeSample;
      response?: string;
    }
  | { type: "table"; headers: string[]; rows: (string)[][] }
  | { type: "callout"; variant: "info" | "warning" | "success"; text: string };

export interface DocPage {
  slug: string;
  group: string;
  title: string;
  description: string;
  blocks: Block[];
}
