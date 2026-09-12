import fs from "node:fs";
import path from "node:path";
import { Project } from "ts-morph";

import { scanSourceFiles } from "./scanner.js";
import { analyzeRoutes } from "./analyzers/routes.js";
import { analyzeNavigation } from "./analyzers/navigation.js";
import { analyzeFixtures } from "./analyzers/fixtures.js";
import {
  analyzeAssertions,
  analyzeAppLevelFeedback
} from "./analyzers/assertions.js";
import {
  writeApplicationFlow,
  writeTestabilityManifest
} from "./output.js";
import type { AnalysisResult } from "./types.js";

const targetProject = path.resolve(
  process.argv[2] ?? "../frontend"
);

const tsConfigFilePath = path.join(
  targetProject,
  "tsconfig.json"
);

if (!fs.existsSync(tsConfigFilePath)) {
  console.error(
    `No tsconfig.json found at ${tsConfigFilePath}`
  );
  console.error(
    "Usage: npm run analyze [path-to-project]"
  );
  process.exit(1);
}

console.log(`Analyzing: ${targetProject}`);

const project = new Project({
  tsConfigFilePath
});

// Diagnostic only: the Project resolves its own file set from the tsconfig.
const scanned = scanSourceFiles(targetProject);

console.log(
  `Source files: ${project.getSourceFiles().length} (scanned ${scanned.length})`
);

const routes = analyzeRoutes(
  project,
  targetProject
);

const navigations = analyzeNavigation(
  project,
  targetProject
);

const fixtures = analyzeFixtures(
  project,
  targetProject
);

const assertions = analyzeAssertions(
  project,
  targetProject,
  routes
);

const appLevelFeedback = analyzeAppLevelFeedback(
  project,
  targetProject
);

console.log(`Routes: ${routes.length}`);
console.log(`Navigations: ${navigations.length}`);
console.log(`Fixtures: ${fixtures.length}`);
console.log(`Route assertions: ${assertions.length}`);
console.log(
  `App-level feedback: ${appLevelFeedback.length}`
);

const ambiguous = navigations.filter(
  (navigation) => navigation.locator?.ambiguous
).length;

console.log(
  `Ambiguous locators: ${ambiguous}`
);

const result: AnalysisResult = {
  targetProject,
  routes,
  navigations,
  fixtures,
  assertions,
  appLevelFeedback
};

const flowPath = path.join(
  process.cwd(),
  "application-flow.md"
);

const manifestPath = path.join(
  process.cwd(),
  "testability-manifest.md"
);

const manifestJsonPath = path.join(
  process.cwd(),
  "testability-manifest.json"
);

writeApplicationFlow(result, flowPath);

writeTestabilityManifest(
  result,
  manifestPath,
  manifestJsonPath
);

console.log(`Generated: ${flowPath}`);
console.log(`Generated: ${manifestPath}`);
console.log(`Generated: ${manifestJsonPath}`);
