import * as TryToGetactualImportErrorMessage from '../TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js'

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    const actualErrorMessage = await TryToGetactualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)
    throw new Error(actualErrorMessage)
  }
}
