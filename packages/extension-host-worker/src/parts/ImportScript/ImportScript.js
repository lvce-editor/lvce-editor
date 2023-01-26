import * as TryToGetActualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'
import * as IsUnhelpfulImportError from '../IsUnhelpfulImportError/IsUnhelpfulImportError.js'

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    if (IsUnhelpfulImportError.isUnhelpfulImportError(error)) {
      const actualErrorMessage = await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
      throw new Error(actualErrorMessage)
    }
    throw error
  }
}
