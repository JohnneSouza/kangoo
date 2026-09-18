import type { Translation } from "../i18n/translations";
import { tools, type ToolDefinition } from "../data/tools";

export interface SearchResult {
  tool: ToolDefinition;
  score: number;
}

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreField(query: string, field: string, weight: number): number {
  if (!field) return 0;
  const normField = normalize(field);
  if (normField === query) return weight * 3;
  if (normField.startsWith(query)) return weight * 2;
  if (normField.includes(query)) return weight * 1.4;
  // token-based partial match
  const tokens = normField.split(/\s+/);
  if (tokens.some((token) => token.startsWith(query))) return weight;
  return 0;
}

export function searchTools(rawQuery: string, t: Translation, limit = 8): SearchResult[] {
  const query = normalize(rawQuery.trim());
  if (!query) return [];

  const results: SearchResult[] = tools.map((tool) => {
    const copy = t.tools[tool.id];
    const categoryLabel = t.categories[tool.categoryId] ?? "";
    let score = 0;
    score += scoreField(query, copy?.name ?? "", 5);
    score += scoreField(query, copy?.keywords ?? "", 3);
    score += scoreField(query, copy?.description ?? "", 1.5);
    score += scoreField(query, categoryLabel, 1);
    score += scoreField(query, tool.id.replace(/-/g, " "), 4);
    return { tool, score };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
