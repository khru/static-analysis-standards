import { describe, expect, it } from "vitest";

import { DependencyCruiserRunError } from "../../src/reporting/dependency-cruiser-error.js";

describe("dependency-cruiser run error", () => {
  it("preserves the target and exit code in its public error message", () => {
    expect(new DependencyCruiserRunError("api", 1)).toMatchObject({
      name: "DependencyCruiserRunError",
      targetName: "api",
      message: "dependency-cruiser exited 1 while analyzing api",
    });
  });
});
