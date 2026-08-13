export function isDomainOrApplicationFile(filePath: string): boolean {
  if (/(^|\/)rules[\\/]/.test(filePath)) {
    return false;
  }
  return /(^|\/)domain[\\/]/.test(filePath) || /(^|\/)application[\\/]/.test(filePath);
}

export function isApplicationFile(filePath: string): boolean {
  return /(^|\/)application[\\/]/.test(filePath);
}

export function isTestFile(filePath: string): boolean {
  return /[\\/]test[\\/]/.test(filePath) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(filePath);
}

export function isConfigurationFile(filePath: string): boolean {
  return /(^|\/)configuration[\\/]/.test(filePath) || /\.config\.[cm]?[jt]s$/.test(filePath);
}

export function isClockFile(filePath: string): boolean {
  return /clock/i.test(filePath);
}
