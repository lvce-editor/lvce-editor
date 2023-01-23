import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.js'

export const tryToGetActualImportErrorMessage = async (url) => {
  try {
    await import(url)
    return `Failed to import ${url}: Unknown Error`
  } catch (error) {
    try {
      const response = await fetch(url)
      switch (response.status) {
        case 404:
          return `Failed to import ${url}: Not found (404)`
        default:
          return TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(error, url, response)
      }
    } catch {
      return `Failed to import ${url}: ${error}`
    }
  }
}
