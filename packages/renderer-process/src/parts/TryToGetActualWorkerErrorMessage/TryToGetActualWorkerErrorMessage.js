import * as GetWorkerDisplayName from '../GetWorkerDisplayName/GetWorkerDisplayName.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'
import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.js'

class NotFoundError extends Error {
  constructor(displayName) {
    super(`Failed to start ${displayName}: Not found (404)`)
    this.name = 'NotFoundError'
  }
}

export const tryToGetActualErrorMessage = async ({ url, name }) => {
  const displayName = GetWorkerDisplayName.getWorkerDisplayName(name)
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    return `Failed to start ${displayName}: ${error}`
  }
  if (response.ok) {
    return await TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage(null, url, response)
  }
  switch (response.status) {
    case HttpStatusCode.NotFound:
      throw new NotFoundError(displayName)
    default:
      return `Failed to start ${displayName}: Unknown Network Error`
  }
}
