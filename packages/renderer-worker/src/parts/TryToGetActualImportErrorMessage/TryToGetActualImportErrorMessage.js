import * as HttpStatusCode from '../HttpStatusCode/HttpStatusCode.js'

const isImportErrorChrome = (error) => {
  return error && error instanceof Error && error.message.startsWith('Failed to fetch dynamically imported module')
}

const isImportErrorFirefox = (error) => {
  return error && error instanceof TypeError && error.message === 'error loading dynamically imported module'
}

const getUrl = (error) => {
  if (error.message.startsWith('Failed to fetch dynamically imported module')) {
    return error.message.slice('Failed to fetch dynamically imported module'.length)
  }
  return ''
}

const getDisplayName = (url) => {
  if (!url) {
    return 'script'
  }
  return url
}

export const tryToGetActualImportErrorMessage = async (error) => {
  console.log({ error })
  const url = getUrl(error)
  const displayName = getDisplayName(url)
  if (isImportErrorChrome(error) || isImportErrorFirefox(error)) {
    try {
      const response = await fetch(url)
      switch (response.status) {
        case HttpStatusCode.NotFound:
          return `Failed to import ${displayName}: Not found (404)`
        default:
          return `Failed to import ${displayName}: Unknown Network Error`
      }
    } catch {
      return `Failed to import ${displayName}: Unknown Network Error`
    }
  }
  return `Failed to import ${displayName}: ${error}`
}
