import { Linter } from "eslint";
import { describe, expect, it } from "vitest";
import tseslint from "typescript-eslint";

import plugin from "../src/index.js";

describe("strict heuristic preset", () => {
  it("should report review candidates as non-blocking warnings that serialize to a JSON artifact", () => {
    const linter = new Linter({ configType: "flat" });
    const messages = linter.verify(
      "class Account {\n  status: string;\n  balance: number;\n}\n",
      {
        files: ["**/*.ts"],
        languageOptions: { parser: tseslint.parser },
        plugins: { standards: plugin },
        ...plugin.configs.strict,
      },
      { filename: "src/modules/accounts/domain/account.ts" },
    );

    expect(messages.some((message) => message.severity === 2)).toBe(false);
    expect(messages.some((message) => message.severity === 1)).toBe(true);

    const candidate = messages.find(
      (message) => message.ruleId === "standards/quality/wrap-primitives-candidate",
    );
    expect(candidate?.message).toContain("Review candidate");

    const artifact = JSON.stringify(messages, null, 2);
    expect(JSON.parse(artifact)).toEqual(messages);
  });
});
