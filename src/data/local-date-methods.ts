export interface UtcEquivalentMethod {
  readonly localName: string;
  readonly utcName: string;
}

export const LOCAL_DATE_GETTERS: readonly UtcEquivalentMethod[] = [
  { localName: "getFullYear", utcName: "getUTCFullYear" },
  { localName: "getMonth", utcName: "getUTCMonth" },
  { localName: "getDate", utcName: "getUTCDate" },
  { localName: "getDay", utcName: "getUTCDay" },
  { localName: "getHours", utcName: "getUTCHours" },
  { localName: "getMinutes", utcName: "getUTCMinutes" },
  { localName: "getSeconds", utcName: "getUTCSeconds" },
  { localName: "getMilliseconds", utcName: "getUTCMilliseconds" },
];

export const LOCAL_DATE_SETTERS: readonly UtcEquivalentMethod[] = [
  { localName: "setFullYear", utcName: "setUTCFullYear" },
  { localName: "setMonth", utcName: "setUTCMonth" },
  { localName: "setDate", utcName: "setUTCDate" },
  { localName: "setHours", utcName: "setUTCHours" },
  { localName: "setMinutes", utcName: "setUTCMinutes" },
  { localName: "setSeconds", utcName: "setUTCSeconds" },
  { localName: "setMilliseconds", utcName: "setUTCMilliseconds" },
];

export const LOCAL_DATE_METHODS: readonly UtcEquivalentMethod[] = [
  ...LOCAL_DATE_GETTERS,
  ...LOCAL_DATE_SETTERS,
];

export interface LocalSerializationMethod {
  readonly localName: string;
  readonly replacement: string;
}

export const LOCAL_SERIALIZATION_METHODS: readonly LocalSerializationMethod[] = [
  { localName: "toDateString", replacement: "toISOString" },
  { localName: "toTimeString", replacement: "toISOString" },
];

export const LOCALE_FORMATTING_METHODS: readonly string[] = [
  "toLocaleDateString",
  "toLocaleTimeString",
  "toLocaleString",
];
