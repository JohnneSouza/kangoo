import type { Lang } from "../data/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Very small, dependency-free syntax highlighter. It's not a full parser,
// just enough regex-based tokenizing to make code samples readable.
export function highlight(code: string, lang: Lang): string {
  const escaped = escapeHtml(code);
  const lines = escaped.split("\n");

  const rules: { pattern: RegExp; className: string }[] = [];

  const strRule = { pattern: /(&quot;|&#39;|'|")(?:(?!\1).)*\1/g as RegExp, className: "tok-str" };
  const commentRuleHash = { pattern: /#.*$/gm, className: "tok-comment" };
  const commentRuleSlash = { pattern: /\/\/.*$/gm, className: "tok-comment" };
  const numRule = { pattern: /\b\d+(\.\d+)?\b/g, className: "tok-num" };

  if (lang === "curl") {
    rules.push(
      { pattern: /^\s*curl/gm, className: "tok-keyword" },
      { pattern: /\s(-{1,2}[a-zA-Z-]+)/g, className: "tok-attr" },
      strRule,
      commentRuleHash
    );
  } else if (lang === "node") {
    rules.push(
      commentRuleSlash,
      strRule,
      {
        pattern:
          /\b(const|let|var|function|async|await|return|import|from|export|default|new|if|else|for|try|catch|require|throw|typeof)\b/g,
        className: "tok-keyword",
      },
      { pattern: /\b([A-Za-z_$][\w$]*)(?=\()/g, className: "tok-fn" },
      numRule
    );
  } else if (lang === "python") {
    rules.push(
      commentRuleHash,
      strRule,
      {
        pattern:
          /\b(def|import|from|return|if|else|elif|for|in|try|except|as|class|with|print|raise|None|True|False|async|await)\b/g,
        className: "tok-keyword",
      },
      { pattern: /\b([A-Za-z_][\w]*)(?=\()/g, className: "tok-fn" },
      numRule
    );
  } else if (lang === "ruby") {
    rules.push(
      commentRuleHash,
      strRule,
      {
        pattern:
          /\b(def|end|require|require_relative|do|if|else|elsif|puts|new|class|module|begin|rescue|nil|true|false)\b/g,
        className: "tok-keyword",
      },
      { pattern: /\b([a-z_][\w]*)(?=\()/g, className: "tok-fn" },
      numRule
    );
  } else if (lang === "php") {
    rules.push(
      commentRuleSlash,
      strRule,
      {
        pattern:
          /\b(function|return|echo|new|if|else|elseif|foreach|as|use|require|namespace|class|public|private|try|catch|throw|null|true|false)\b/g,
        className: "tok-keyword",
      },
      { pattern: /\$[a-zA-Z_][\w]*/g, className: "tok-var" },
      numRule
    );
  } else {
    rules.push(strRule, numRule);
  }

  return lines
    .map((line) => {
      // Tokenize using a placeholder strategy so rules don't overlap badly.
      const tokens: { start: number; end: number; className: string }[] = [];
      for (const rule of rules) {
        rule.pattern.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = rule.pattern.exec(line))) {
          const start = m.index;
          const end = start + m[0].length;
          const overlaps = tokens.some((t) => start < t.end && end > t.start);
          if (!overlaps) {
            tokens.push({ start, end, className: rule.className });
          }
          if (m[0].length === 0) rule.pattern.lastIndex++;
        }
      }
      tokens.sort((a, b) => a.start - b.start);
      let out = "";
      let cursor = 0;
      for (const t of tokens) {
        if (t.start < cursor) continue;
        out += line.slice(cursor, t.start);
        out += `<span class="${t.className}">${line.slice(t.start, t.end)}</span>`;
        cursor = t.end;
      }
      out += line.slice(cursor);
      return out || " ";
    })
    .join("\n");
}
