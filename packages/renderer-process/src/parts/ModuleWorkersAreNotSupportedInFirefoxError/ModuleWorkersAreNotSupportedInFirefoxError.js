export class ModuleWorkersAreNotSupportedInFirefoxError extends Error {
  constructor() {
    super('module workers are not supported in firefox')
  }
}
