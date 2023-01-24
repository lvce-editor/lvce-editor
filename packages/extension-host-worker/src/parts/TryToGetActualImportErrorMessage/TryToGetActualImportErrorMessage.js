import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.js'

class NotFoundError extends Error {
  constructor(url) {
    super(`Failed to import ${url}: Not found (404)`)
    this.name = 'NotFoundError'
  }
}

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
      throw new NotFoundError(url)
    default:
      return `Failed to import ${url}: ${error}`
  }
}
