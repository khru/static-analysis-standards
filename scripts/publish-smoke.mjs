import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

class PublishSmokeError extends Error {}

const exec = promisify(execFile);
const packageDirectory = fileURLToPath(new globalThis.URL("..", import.meta.url));
const smokeDirectory = await mkdtemp(join(os.tmpdir(), "static-analysis-publish-smoke-"));

try {
  const { stdout } = await exec("pnpm", ["pack", "--pack-destination", smokeDirectory], {
    cwd: packageDirectory,
  });
  const packageFile = (await readdir(smokeDirectory)).find((file) => file.endsWith(".tgz"));
  if (!packageFile) {
    throw new PublishSmokeError(`pnpm pack did not create a tarball: ${stdout}`);
  }

  const packagePath = join(smokeDirectory, packageFile);
  const archiveListing = (await exec("tar", ["-tzf", packagePath])).stdout
    .split("\n")
    .filter(Boolean);
  for (const requiredEntry of ["package/dist/index.js", "package/dist/index.d.ts"]) {
    if (!archiveListing.includes(requiredEntry)) {
      throw new PublishSmokeError(`Published archive is missing ${requiredEntry}`);
    }
  }
  if (archiveListing.some((entry) => entry.startsWith("package/dist/reporting/"))) {
    throw new PublishSmokeError("Published archive contains internal reporting modules");
  }

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

  const installedPackageDirectory = join(
    consumerDirectory,
    "node_modules",
    "@evalverde",
    "static-analysis-standards",
  );
  await access(join(installedPackageDirectory, "dist", "index.js"));

  const consumerCheck = [
    "const plugin = await import('@evalverde/static-analysis-standards');",
    "if (!plugin.default || !plugin.default.rules || !plugin.default.configs) process.exit(1);",
    "const metadata = await import('@evalverde/static-analysis-standards/package.json', { with: { type: 'json' } });",
    `if (metadata.default.name !== ${JSON.stringify(packageManifest.name)}) process.exit(1);`,
    "try { await import('@evalverde/static-analysis-standards/dist/index.js'); process.exit(1); } catch (error) { if (error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') process.exit(1); }",
  ].join("\n");
  await exec("node", ["--input-type=module", "-e", consumerCheck], { cwd: consumerDirectory });
} finally {
  await rm(smokeDirectory, { recursive: true, force: true });
}
