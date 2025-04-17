import * as ErrorWorker from '../ErrorWorker/ErrorWorker.ts'

const serializeError = (error) => {
  if (!error) {
    return error
  }
  return {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
    codeFrame: error.codeFrame,
    constructor: {
      name: error.constructor.name,
    },
  }
}

export const prepare = async (error) => {
  try {
    const serialized = serializeError(error)
    const prepared = await ErrorWorker.invoke('Errors.prepare', serialized)
    return prepared
  } catch {
    return error
  }
}

export const print = async (error, prefix = '') => {
  await ErrorWorker.invoke('Errors.print', error, prefix)
}

export const getMessage = (error) => {
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error && error.message) {
    return `${error.constructor.name}: ${error.message}`
  }
  return `Error: ${error}`
}
