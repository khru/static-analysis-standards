/* global process */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const [shardName, mutatePattern] = process.argv.slice(2).filter((argument) => argument !== "--");
if (!shardName || !mutatePattern) process.exit(2);

const shardDirectory = ".stryker-shards";
const configPath = `${shardDirectory}/${shardName}.json`;
const reportPath = `reports/mutation/${shardName}.json`;

await mkdir(`${shardDirectory}`, { recursive: true });
await mkdir("reports/mutation", { recursive: true });
await writeFile(
  configPath,
  JSON.stringify(
    {
      $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
      testRunner: "vitest",
      coverageAnalysis: "perTest",
      checkers: ["typescript"],
      tsconfigFile: "tsconfig.json",
      mutate: mutatePattern.split(","),
      vitest: { configFile: "vitest.config.ts" },
      plugins: ["@stryker-mutator/vitest-runner", "@stryker-mutator/typescript-checker"],
      reporters: ["clear-text", "json"],
      jsonReporter: { fileName: reportPath },
      thresholds: { high: 100, low: 100, break: 100 },
      concurrency: 8,
      timeoutMS: 30000,
    },
    null,
    2,
  ),
);

const exitCode = await new Promise((resolve) => {
  const child = spawn("pnpm", ["exec", "stryker", "run", configPath], {
    stdio: "inherit",
  });
  child.on("close", (code) => resolve(code ?? 1));
});

await rm(configPath, { force: true });
process.exitCode = exitCode;
