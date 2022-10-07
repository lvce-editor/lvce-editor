const getDisplayName = (name) => {
  if (!name) {
    return '<unknown> worker'
  }
  if (name.endsWith('Worker')) {
    return name.toLowerCase()
  }
  return `${name} worker`
}

const tryToGetActualErrorMessage = async ({ url, name }) => {
  const displayName = getDisplayName(name)
  try {
    await import(url)
    return `Failed to start ${displayName}: Unknown Error`
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

const isFirefoxError = (message) => {
  return [
    'SyntaxError: import declarations may only appear at top level of a module',
    'SyntaxError: export declarations may only appear at top level of a module',
  ].includes(message)
}

export const create = async ({ url, name }) => {
  url += '?chrome-bug-workaround'
  console.log('create worker')
  try {
    console.log({ url, name })
    const worker = new Worker(url, {
      type: 'module',
      name,
    })
    const port = await new Promise((resolve, reject) => {
      const cleanup = () => {
        worker.onmessage = null
        worker.onerror = null
      }
      const handleFirstMessage = (event) => {
        cleanup()
        if (event.data.method === 'ready') {
          resolve(event.ports[0])
        } else {
          reject(new Error('unexpected first message from renderer worker'))
        }
      }
      const handleFirstError = async (event) => {
        cleanup()
        if (isFirefoxError(event.message)) {
          event.preventDefault()
          reject(new Error('module workers are not supported in firefox'))
        } else {
          const actualErrorMessage = await tryToGetActualErrorMessage({
            url,
            name,
          })
          reject(new Error(actualErrorMessage))
        }
      }
      worker.onmessage = handleFirstMessage
      worker.onerror = handleFirstError
    })
    console.log({ port })
    return port
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message === 'module workers are not supported in firefox'
    ) {
      const IpcParentWithMessagePort = await import(
        './IpcParentWithMessagePort.js'
      )
      return IpcParentWithMessagePort.create({ url })
    }
    throw error
  }
}
