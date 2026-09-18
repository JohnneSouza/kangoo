function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-./]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

export const caseConverters: Record<string, (input: string) => string> = {
  camelCase: (input) => {
    const words = splitWords(input).map((w) => w.toLowerCase());
    return words
      .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join("");
  },
  PascalCase: (input) => {
    const words = splitWords(input).map((w) => w.toLowerCase());
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  },
  snake_case: (input) => splitWords(input).map((w) => w.toLowerCase()).join("_"),
  "kebab-case": (input) => splitWords(input).map((w) => w.toLowerCase()).join("-"),
  "CONSTANT_CASE": (input) => splitWords(input).map((w) => w.toUpperCase()).join("_"),
  "Title Case": (input) =>
    splitWords(input)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" "),
  "Sentence case": (input) => {
    const words = splitWords(input).map((w) => w.toLowerCase());
    const joined = words.join(" ");
    return joined ? joined.charAt(0).toUpperCase() + joined.slice(1) : "";
  },
  "UPPER CASE": (input) => input.toUpperCase(),
  "lower case": (input) => input.toLowerCase(),
};
