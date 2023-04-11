import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import { NotFoundError } from '../NotFoundError/NotFoundError.js'
import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.js'

const getUrl = (error) => {
  if (error.message.startsWith('Failed to fetch dynamically imported module:')) {
    return error.message.slice('Failed to fetch dynamically imported module:'.length)
  }
  return ''
}

export const tryToGetActualImportErrorMessage = async (url, error) => {
  if (!url) {
    url = getUrl(error)
  }
  if (!url) {
    return `Failed to import script: ${error}`
  }
  let response
  try {
    response = await fetch(url)
  } catch {
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
