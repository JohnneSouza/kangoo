import type { DocPage } from "../types";
import { gettingStartedPages } from "./gettingStarted";
import { guidePages } from "./guides";
import { apiReferencePages } from "./apiReference";
import { examplePages } from "./examples";

export const allPages: DocPage[] = [
  ...gettingStartedPages,
  ...guidePages,
  ...apiReferencePages,
  ...examplePages,
];

export const groupOrder = ["Getting started", "Guides", "API reference", "Examples"];

export function getPageBySlug(slug: string): DocPage | undefined {
  return allPages.find((p) => p.slug === slug);
}

export function getGroupedNav(): { group: string; pages: DocPage[] }[] {
  return groupOrder.map((group) => ({
    group,
    pages: allPages.filter((p) => p.group === group),
  }));
}
