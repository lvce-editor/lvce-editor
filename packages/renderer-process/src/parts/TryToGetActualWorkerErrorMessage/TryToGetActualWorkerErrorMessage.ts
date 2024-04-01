import * as GetWorkerDisplayName from '../GetWorkerDisplayName/GetWorkerDisplayName.ts'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.ts'
import * as TryToGetActualErrorMessageWhenNetworkRequestSucceeds from '../TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.ts'

export const tryToGetActualErrorMessage = async ({ url, name }) => {
  const displayName = GetWorkerDisplayName.getWorkerDisplayName(name)
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    return `Failed to start ${displayName}: ${error}`
  }
  if (response.ok) {
    const contentType = response.headers.get('Content-Type')
    if (contentType !== 'application/javascript' && contentType !== 'text/javascript') {
      return `Failed to start ${displayName}: Content type for worker must be application/javascript`
    }
    const crossOriginEmbedderPolicy = response.headers.get('Cross-Origin-Embedder-Policy')
    if (!crossOriginEmbedderPolicy) {
      return `Failed to start ${displayName}: Cross Origin Embedder Policy header is missing`
    }
    if (crossOriginEmbedderPolicy !== 'require-corp') {
      return `Failed to start ${displayName}: Cross Origin Embedder Policy has wrong value`
    }
    // @ts-ignore
    return await TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage({
      url,
      response,
      workerName: displayName,
    })
  }
  switch (response.status) {
    case HttpStatusCode.NotFound:
      throw new Error(`Failed to start ${displayName}: Not found (404)`)
    default:
      return `Failed to start ${displayName}: Unknown Network Error`
  }
}
