const isImportErrorChrome = (error) => {
  return error && error instanceof Error && error.message.startsWith('Failed to fetch dynamically imported module')
}

const isImportErrorFirefox = (error) => {
  return error && error instanceof TypeError && error.message === 'error loading dynamically imported module'
}

export const tryToGetActualImportErrorMessage = async (url) => {
  try {
    await import(url)
    return `Failed to import ${url}: Unknown Error`
  } catch (error) {
    if (isImportErrorChrome(error) || isImportErrorFirefox(error)) {
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
