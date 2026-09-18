import type { ComponentType } from "react";
import {
  Binary,
  Braces,
  Clock,
  Code2,
  Diff,
  FileCode2,
  FileText,
  Fingerprint,
  Hash,
  KeyRound,
  Link2,
  Palette,
  ShieldCheck,
  Shuffle,
  SpellCheck2,
  Type,
  Regex,
  Text,
} from "lucide-react";

import { Base64Tool } from "../tools/Base64Tool";
import { UrlEncodeTool } from "../tools/UrlEncodeTool";
import { HtmlEntitiesTool } from "../tools/HtmlEntitiesTool";
import { JwtDecoderTool } from "../tools/JwtDecoderTool";
import { UuidGeneratorTool } from "../tools/UuidGeneratorTool";
import { PasswordGeneratorTool } from "../tools/PasswordGeneratorTool";
import { LoremIpsumTool } from "../tools/LoremIpsumTool";
import { HashGeneratorTool } from "../tools/HashGeneratorTool";
import { NumberBaseTool } from "../tools/NumberBaseTool";
import { ColorConverterTool } from "../tools/ColorConverterTool";
import { TimestampConverterTool } from "../tools/TimestampConverterTool";
import { CaseConverterTool } from "../tools/CaseConverterTool";
import { JsonFormatterTool } from "../tools/JsonFormatterTool";
import { RegexTesterTool } from "../tools/RegexTesterTool";
import { DiffCheckerTool } from "../tools/DiffCheckerTool";
import { MarkdownPreviewTool } from "../tools/MarkdownPreviewTool";
import { SlugifyTool } from "../tools/SlugifyTool";
import { WordCounterTool } from "../tools/WordCounterTool";

export type CategoryId = "encoding" | "generators" | "converters" | "formatters" | "text";

export const categoryOrder: CategoryId[] = ["encoding", "generators", "converters", "formatters", "text"];

export interface ToolDefinition {
  id: string;
  categoryId: CategoryId;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
}

export const tools: ToolDefinition[] = [
  { id: "base64", categoryId: "encoding", icon: Binary, component: Base64Tool },
  { id: "url-encode", categoryId: "encoding", icon: Link2, component: UrlEncodeTool },
  { id: "html-entities", categoryId: "encoding", icon: Code2, component: HtmlEntitiesTool },
  { id: "jwt-decoder", categoryId: "encoding", icon: ShieldCheck, component: JwtDecoderTool },

  { id: "uuid-generator", categoryId: "generators", icon: Fingerprint, component: UuidGeneratorTool },
  { id: "password-generator", categoryId: "generators", icon: KeyRound, component: PasswordGeneratorTool },
  { id: "lorem-ipsum", categoryId: "generators", icon: FileText, component: LoremIpsumTool },
  { id: "hash-generator", categoryId: "generators", icon: Hash, component: HashGeneratorTool },

  { id: "number-base", categoryId: "converters", icon: Braces, component: NumberBaseTool },
  { id: "color-converter", categoryId: "converters", icon: Palette, component: ColorConverterTool },
  { id: "timestamp-converter", categoryId: "converters", icon: Clock, component: TimestampConverterTool },
  { id: "case-converter", categoryId: "converters", icon: Type, component: CaseConverterTool },

  { id: "json-formatter", categoryId: "formatters", icon: FileCode2, component: JsonFormatterTool },
  { id: "regex-tester", categoryId: "formatters", icon: Regex, component: RegexTesterTool },
  { id: "diff-checker", categoryId: "formatters", icon: Diff, component: DiffCheckerTool },
  { id: "markdown-preview", categoryId: "formatters", icon: FileText, component: MarkdownPreviewTool },

  { id: "slugify", categoryId: "text", icon: Shuffle, component: SlugifyTool },
  { id: "word-counter", categoryId: "text", icon: SpellCheck2, component: WordCounterTool },
];

export const toolIcon = Text;

export function getToolById(id: string) {
  return tools.find((tool) => tool.id === id);
}
