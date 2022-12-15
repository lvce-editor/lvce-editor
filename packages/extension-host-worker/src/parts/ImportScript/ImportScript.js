const tryToGetActualErrorMessage = async (url) => {
  try {
    await import(url)
    return `Failed to import ${url}: Unknown Error`
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.startsWith('Failed to fetch dynamically imported module')
    ) {
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

export const importScript = async (url) => {
  try {
    return await import(url)
  } catch (error) {
    const actualErrorMessage = await tryToGetActualErrorMessage(url)
    throw new Error(actualErrorMessage)
  }
}
