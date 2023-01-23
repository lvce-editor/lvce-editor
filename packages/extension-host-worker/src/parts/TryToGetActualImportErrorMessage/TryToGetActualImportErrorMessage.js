import * as IsImportError from '../IsImportError/IsImportError.js'

export const tryToGetActualImportErrorMessage = async (url) => {
  try {
    await import(url)
    return `Failed to import ${url}: Unknown Error`
  } catch (error) {
    if (IsImportError.isImportError(error)) {
      try {
        const response = await fetch(url)
        switch (response.status) {
          case 404:
            return `Failed to import ${url}: Not found (404)`
          default:
            return `Failed to import ${url}: Unknown Network Error`
        }
      } catch {
        return `Failed to import ${url}: Unknown Network Error`
      }
    }
    return `Failed to import ${url}: ${error}`
  }
}
