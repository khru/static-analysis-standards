import { describe, expect, it } from "vitest";

import { InvalidAnalysisTargetError } from "../../src/reporting/invalid-analysis-target-error.js";

describe("invalid analysis target error", () => {
  it("identifies the unsupported target", () => {
    expect(new InvalidAnalysisTargetError("unknown")).toMatchObject({
      name: "InvalidAnalysisTargetError",
      message: "Unknown static-analysis target: unknown",
    });
  });
});
