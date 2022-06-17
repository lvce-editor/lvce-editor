/* istanbul ignore file */
const METHOD_MESSAGE_PORT = 1
const METHOD_MODULE_WORKER = 2
const METHOD_REFERENCE_PORT = 3

/**
 * @type {number}
 */
const METHOD_PREFERRED = METHOD_MESSAGE_PORT

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

const createReferencePort = async (url) => {
  const referencePort = await new Promise((resolve) => {
    globalThis.acceptReferencePort = resolve
    import(url)
  })
  delete globalThis.acceptReferencePort
  return referencePort
}

export const create = async (url) => {
  switch (METHOD_PREFERRED) {
    case METHOD_MODULE_WORKER:
      return createModuleWorker(url)
    case METHOD_MESSAGE_PORT:
      return createMessagePort(url)
    case METHOD_REFERENCE_PORT:
      return createReferencePort(url)
    default:
      throw new Error('unknown method')
  }
}
