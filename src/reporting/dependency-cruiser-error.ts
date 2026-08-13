export class DependencyCruiserRunError extends Error {
  readonly targetName: string;

  constructor(targetName: string, exitCode: number) {
    super(`dependency-cruiser exited ${exitCode} while analyzing ${targetName}`);
    this.name = "DependencyCruiserRunError";
    this.targetName = targetName;
  }
}
