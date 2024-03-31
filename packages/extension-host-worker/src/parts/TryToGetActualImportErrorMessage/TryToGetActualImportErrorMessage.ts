import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.ts'

export const tryToGetActualImportErrorMessage = async (url, error) => {
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    return `Failed to import ${url}: ${error}`
  }
  if (response.ok) {
    return await TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(error, url, response)
  }
  switch (response.status) {
    case HttpStatusCode.NotFound:
      throw new Error(`Failed to import ${url}: Not found (404)`)
    default:
      return `Failed to import ${url}: ${error}`
  }
}
