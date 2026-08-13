const WORD_BOUNDARY = /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;

export function nameSegments(name: string): string[] {
  const separatedParts = name.split(/[._-]+/);
  const words = separatedParts.flatMap((part) => part.split(WORD_BOUNDARY));
  return words.map((part) => part.toLowerCase());
}
