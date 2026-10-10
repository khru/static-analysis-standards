import { access, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

class PackageVerificationError extends Error {}

const packageDirectory = fileURLToPath(new globalThis.URL("..", import.meta.url));
const packageManifest = JSON.parse(await readFile(join(packageDirectory, "package.json"), "utf8"));

const requiredFiles = [
  packageManifest.main,
  packageManifest.types,
  "./dist/index.js.map",
  "./dist/index.d.ts.map",
].map((file) => join(packageDirectory, file));

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    throw new PackageVerificationError(
      `Package verification failed: ${relative(packageDirectory, file)} is missing. Run the build before packing.`,
    );
  }
}

if (packageManifest.files?.length !== 1 || packageManifest.files[0] !== "dist") {
  throw new PackageVerificationError(
    'Package verification failed: package.json must publish exactly the "dist" directory.',
  );
}

globalThis.process.stderr.write(`Verified package entry point: ${packageManifest.main}\n`);
