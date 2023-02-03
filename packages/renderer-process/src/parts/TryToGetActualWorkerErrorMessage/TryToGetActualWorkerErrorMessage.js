import * as GetWorkerDisplayName from '../GetWorkerDisplayName/GetWorkerDisplayName.js'
import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

export const tryToGetActualErrorMessage = async ({ url, name }) => {
  const displayName = GetWorkerDisplayName.getWorkerDisplayName(name)
  try {
    globalThis.DONT_EXECUTE = 1
    await import(url)
    return `Failed to start ${displayName}: Unknown Error`
  } catch (error) {
    if (error && error instanceof Error && error.message.startsWith('Failed to fetch dynamically imported module')) {
      try {
        const response = await fetch(url)
        switch (response.status) {
          case HttpStatusCode.NotFound:
            return `Failed to start ${displayName}: Not found (404)`
          default:
            return `Failed to start ${displayName}: Unknown Network Error`
        }
      } catch {
        return `Failed to start ${displayName}: Unknown Network Error`
      }
    }
    return `Failed to start ${displayName}: ${error}`
  }
}
