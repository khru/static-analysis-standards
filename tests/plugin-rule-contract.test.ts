import { expect, it } from "vitest";

import { rules } from "../src/index.js";

it("keeps every registered rule metadata contract stable", () => {
  const metadata = Object.fromEntries(
    Object.entries(rules).map(([name, rule]) => [
      name,
      {
        defaultOptions: rule.defaultOptions,
        meta: rule.meta,
      },
    ]),
  );

  expect(metadata).toMatchSnapshot();
});
