const METHOD_MESSAGE_PORT = 1
const METHOD_MODULE_WORKER = 2

/**
 * @type {number}
 */
const METHOD_PREFERRED = METHOD_MESSAGE_PORT

// TODO add tests for both these methods (if possible)
const createModuleWorker = (url) => {
  return new Worker(url, {
    type: 'module',
  })
}

const createMessagePort = async (url) => {
  const port = await new Promise((resolve) => {
    globalThis.acceptPort = resolve
    import(url)
  })
  delete globalThis.acceptPort
  return port
}

export const create = async (url) => {
  switch (METHOD_PREFERRED) {
    case METHOD_MODULE_WORKER:
      return createModuleWorker(url)
    case METHOD_MESSAGE_PORT:
      return createMessagePort(url)
    default:
      throw new Error('unknown method')
  }
}
