import { useThemeContext } from "../context/ThemeContext";

const RUBIK_COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#f8fafc"];

function RubikCube({ className, size = 56 }: { className?: string; size?: number }) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <div className="rubik-cube-face h-full w-full shadow-lg">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} style={{ backgroundColor: RUBIK_COLORS[i % RUBIK_COLORS.length] }} />
        ))}
      </div>
    </div>
  );
}

function ChessPiece({ className, symbol = "♞", size = 40 }: { className?: string; symbol?: string; size?: number }) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden="true"
    >
      {symbol}
    </span>
  );
}

/**
 * Full-page fixed decorative background that changes with the selected theme.
 */
export default function ThemeDecor() {
  const { themeStyle } = useThemeContext();

  if (themeStyle === "chess") {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden chess-board-bg">
        <ChessPiece symbol="♔" size={90} className="absolute -left-6 top-24 text-black/10 dark:text-white/10 animate-float-slow" />
        <ChessPiece symbol="♞" size={70} className="absolute right-10 top-1/3 text-black/10 dark:text-white/10 animate-float" />
        <ChessPiece symbol="♜" size={80} className="absolute left-1/4 bottom-16 text-black/10 dark:text-white/10 animate-float-slower" />
        <ChessPiece symbol="♛" size={100} className="absolute right-1/4 bottom-40 text-black/[0.07] dark:text-white/[0.07] animate-float-slow" />
        <ChessPiece symbol="♝" size={60} className="absolute right-1/2 top-10 text-black/10 dark:text-white/10 animate-float" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden rubik-grid-bg">
      <RubikCube size={64} className="absolute left-8 top-28 opacity-20 animate-float-slow" />
      <RubikCube size={44} className="absolute right-14 top-1/4 opacity-20 animate-float" />
      <RubikCube size={54} className="absolute left-1/3 bottom-20 opacity-20 animate-float-slower" />
      <RubikCube size={38} className="absolute right-1/3 bottom-1/3 opacity-20 animate-float" />
      <RubikCube size={70} className="absolute right-1/4 top-1/2 opacity-10 animate-float-slow" />
    </div>
  );
}

export { RubikCube, ChessPiece };
