export class InvalidAnalysisTargetError extends Error {
  public constructor(targetName: string) {
    super(`Unknown static-analysis target: ${targetName}`);
    this.name = "InvalidAnalysisTargetError";
  }
}
