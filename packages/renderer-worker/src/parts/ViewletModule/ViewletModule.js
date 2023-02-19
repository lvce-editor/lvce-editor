import * as ViewletModuleInternal from '../ViewletModuleInternal/ViewletModuleInternal.js'

export const load = async (moduleId) => {
  try {
    return await ViewletModuleInternal.load(moduleId)
  } catch (error) {
    const IsImportError = await import('../IsImportError/IsImportError.js')
    if (IsImportError.isImportError(error)) {
      const TryToGetActualImportErrorMessage = await import('../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js')
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage('', error)
      throw new Error(actualErrorMessage)
    }
    throw error
  }
}
