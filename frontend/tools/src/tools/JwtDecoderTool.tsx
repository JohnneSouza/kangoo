import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { ErrorText, Label, TextArea } from "../components/ui";
import { cn } from "../utils/cn";

function base64UrlDecode(segment: string) {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function tryPretty(json: string) {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

export function JwtDecoderTool() {
  const { t, locale } = useI18n();
  const tt = useToolStrings(locale);
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3NDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: tt("jwt.invalid") };
    try {
      const header = tryPretty(base64UrlDecode(parts[0]));
      const payload = tryPretty(base64UrlDecode(parts[1]));
      let exp: number | null = null;
      let iat: number | null = null;
      try {
        const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
        exp = typeof payloadObj.exp === "number" ? payloadObj.exp : null;
        iat = typeof payloadObj.iat === "number" ? payloadObj.iat : null;
      } catch {
        /* not JSON */
      }
      return { header, payload, signature: parts[2] ?? "", exp, iat, error: "" };
    } catch {
      return { error: tt("jwt.invalid") };
    }
  }, [token, tt]);

  const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : null;

  return (
    <>
      <div>
        <Label>{t.common.input}</Label>
        <TextArea
          rows={5}
          value={token}
          placeholder={tt("jwt.placeholder")}
          onChange={(e) => setToken(e.target.value)}
          className="break-all"
        />
        <ErrorText>{decoded.error}</ErrorText>
      </div>

      {!decoded.error && (
        <>
          {(decoded.exp || decoded.iat) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {decoded.iat && (
                <div className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  {tt("jwt.issuedAt")}: {new Date(decoded.iat * 1000).toLocaleString()}
                </div>
              )}
              {decoded.exp && (
                <div
                  className={cn(
                    "rounded-lg border px-3 py-1.5",
                    isExpired
                      ? "border-rose-200 text-rose-600 dark:border-rose-900/50 dark:text-rose-400"
                      : "border-emerald-200 text-emerald-600 dark:border-emerald-900/50 dark:text-emerald-400"
                  )}
                >
                  {tt("jwt.expiresAt")}: {new Date(decoded.exp * 1000).toLocaleString()} ·{" "}
                  {isExpired ? tt("jwt.expired") : tt("jwt.notExpired")}
                </div>
              )}
            </div>
          )}
          <div>
            <Label>{tt("jwt.header")}</Label>
            <TextArea rows={4} value={decoded.header} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
          </div>
          <div>
            <Label>{tt("jwt.payload")}</Label>
            <TextArea rows={8} value={decoded.payload} readOnly className="bg-violet-50/40 dark:bg-slate-950/60" />
          </div>
          <div>
            <Label>{tt("jwt.signature")}</Label>
            <TextArea
              rows={2}
              value={decoded.signature}
              readOnly
              className="break-all bg-slate-100 dark:bg-slate-900"
            />
          </div>
        </>
      )}
    </>
  );
}
