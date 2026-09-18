import { useMemo, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useToolStrings } from "../i18n/toolStrings";
import { CopyButton, Label, TextInput } from "../components/ui";

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace("#", "").trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex([r, g, b]: [number, number, number]) {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

function parseRgbString(input: string): [number, number, number] | null {
  const match = input.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function parseHslString(input: string): [number, number, number] | null {
  const match = input.match(/hsla?\(\s*([\d.]+)[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function ColorConverterTool() {
  const { locale } = useI18n();
  const tt = useToolStrings(locale);
  const [rgb, setRgb] = useState<[number, number, number]>([124, 58, 237]);
  const [error, setError] = useState("");

  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);

  const [hexInput, setHexInput] = useState(hex);
  const [rgbInput, setRgbInput] = useState(`rgb(${rgb.join(", ")})`);
  const [hslInput, setHslInput] = useState(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`);

  const applyRgb = (next: [number, number, number]) => {
    setRgb(next);
    setHexInput(rgbToHex(next));
    setRgbInput(`rgb(${next.join(", ")})`);
    const nh = rgbToHsl(next);
    setHslInput(`hsl(${nh[0]}, ${nh[1]}%, ${nh[2]}%)`);
    setError("");
  };

  const onHexChange = (val: string) => {
    setHexInput(val);
    const parsed = hexToRgb(val);
    if (!parsed) {
      setError(tt("color.invalid"));
      return;
    }
    applyRgb(parsed);
  };

  const onRgbChange = (val: string) => {
    setRgbInput(val);
    const parsed = parseRgbString(val);
    if (!parsed) {
      setError(tt("color.invalid"));
      return;
    }
    applyRgb([clamp(parsed[0], 0, 255), clamp(parsed[1], 0, 255), clamp(parsed[2], 0, 255)]);
  };

  const onHslChange = (val: string) => {
    setHslInput(val);
    const parsed = parseHslString(val);
    if (!parsed) {
      setError(tt("color.invalid"));
      return;
    }
    applyRgb(hslToRgb([clamp(parsed[0], 0, 360), clamp(parsed[1], 0, 100), clamp(parsed[2], 0, 100)]));
  };

  return (
    <>
      <div
        className="h-28 w-full rounded-xl border border-slate-200 shadow-inner dark:border-slate-800"
        style={{ backgroundColor: hex }}
      />

      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("color.hex")}</Label>
            <CopyButton value={hexInput} />
          </div>
          <TextInput value={hexInput} onChange={(e) => onHexChange(e.target.value)} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("color.rgb")}</Label>
            <CopyButton value={rgbInput} />
          </div>
          <TextInput value={rgbInput} onChange={(e) => onRgbChange(e.target.value)} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>{tt("color.hsl")}</Label>
            <CopyButton value={hslInput} />
          </div>
          <TextInput value={hslInput} onChange={(e) => onHslChange(e.target.value)} />
        </div>
        <div>
          <Label>{tt("color.preview")}</Label>
          <input
            type="color"
            value={hex}
            onChange={(e) => onHexChange(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
      {error && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
          {error}
        </p>
      )}
    </>
  );
}
