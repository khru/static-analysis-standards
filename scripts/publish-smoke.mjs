import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

class PublishSmokeError extends Error {}

const exec = promisify(execFile);
const packageDirectory = fileURLToPath(new globalThis.URL("..", import.meta.url));
const smokeDirectory = await mkdtemp(join(os.tmpdir(), "community-ops-publish-smoke-"));

try {
  const { stdout } = await exec("pnpm", ["pack", "--pack-destination", smokeDirectory], {
    cwd: packageDirectory,
  });
  const packageFile = (await readdir(smokeDirectory)).find((file) => file.endsWith(".tgz"));
  if (!packageFile) {
    throw new PublishSmokeError(`pnpm pack did not create a tarball: ${stdout}`);
  }

  const packagePath = join(smokeDirectory, packageFile);
  const packageManifest = JSON.parse(
    await readFile(join(packageDirectory, "package.json"), "utf8"),
  );
  const consumerDirectory = join(smokeDirectory, "consumer");
  await mkdir(consumerDirectory);
  await writeFile(
    join(consumerDirectory, "package.json"),
    JSON.stringify({ name: "publish-smoke-consumer", private: true, type: "module" }, null, 2),
  );
  await exec("pnpm", ["add", "--ignore-scripts", packagePath], { cwd: consumerDirectory });

  const consumerCheck = [
    "const plugin = await import('@evalverde/static-analysis-standards');",
    "if (!plugin.default || !plugin.default.rules || !plugin.default.configs) process.exit(1);",
    "const metadata = await import('@evalverde/static-analysis-standards/package.json', { with: { type: 'json' } });",
    `if (metadata.default.name !== ${JSON.stringify(packageManifest.name)}) process.exit(1);`,
    "try { await import('@evalverde/static-analysis-standards/dist/index.js'); process.exit(1); } catch {}",
  ].join("\n");
  await exec("node", ["--input-type=module", "-e", consumerCheck], { cwd: consumerDirectory });
} finally {
  await rm(smokeDirectory, { recursive: true, force: true });
}
