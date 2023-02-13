import * as IsImportError from '../IsImportError/IsImportError.js'
import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'
import * as ViewletModuleInternal from '../ViewletModuleInternal/ViewletModuleInternal.js'

export const load = async (moduleId) => {
  try {
    return await ViewletModuleInternal.load(moduleId)
  } catch (error) {
    if (IsImportError.isImportError(error)) {
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage('', error)
      throw new Error(actualErrorMessage)
    }
    throw error
  }
}
