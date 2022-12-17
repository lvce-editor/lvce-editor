import * as Command from '../Command/Command.js'

class NonError extends Error {
  name = 'NonError'

  constructor(message) {
    super(message)
  }
}

// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.js (License MIT)
const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}

const serializeError = (error) => {
  error = ensureError(error)
  return {
    stack: error.stack,
    message: error.message,
    name: error.name,
    type: error.constructor.name,
  }
}

export const getResponse = async (message) => {
  try {
    const result = await Command.execute(message.method, ...message.params)
    return {
      jsonrpc: '2.0',
      id: message.id,
      result,
    }
  } catch (error) {
    const serializedError = serializeError(error)
    return {
      jsonrpc: '2.0',
      id: message.id,
      error: {
        message: serializedError.message,
        stack: serializedError.stack,
        name: serializedError.name,
        type: serializedError.type,
      },
    }
  }
}
