import fg from "fast-glob";

export function scanSourceFiles(targetProject: string): string[] {
  return fg.sync(
    ["src/**/*.{ts,tsx,js,jsx}"],
    {
      cwd: targetProject,
      absolute: true,
      ignore: [
        "**/node_modules/**",
        "**/dist/**",
        "**/build/**"
      ]
    }
  );
}
