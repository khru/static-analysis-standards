export interface DeprecatedGlobalFunction {
  readonly name: string;
  readonly replacement: string;
}

export interface DeprecatedMethod {
  readonly name: string;
  readonly replacement: string;
}

export const DEPRECATED_GLOBAL_FUNCTIONS: readonly DeprecatedGlobalFunction[] = [
  { name: "escape", replacement: "encodeURIComponent" },
  { name: "unescape", replacement: "decodeURIComponent" },
];

export const DEPRECATED_METHODS: readonly DeprecatedMethod[] = [
  { name: "substr", replacement: "slice" },
  { name: "trimLeft", replacement: "trimStart" },
  { name: "trimRight", replacement: "trimEnd" },
  { name: "getYear", replacement: "getFullYear" },
  { name: "setYear", replacement: "setFullYear" },
  { name: "toGMTString", replacement: "toUTCString" },
];
