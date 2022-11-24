const Command = require('../Command/Command.js')
const Logger = require('../Logger/Logger.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')

exports.getResponse = async (message) => {
  try {
    const result = await Command.invoke(message.method, ...message.params)
    return {
      jsonrpc: JsonRpc.Version,
      result,
      id: message.id,
    }
  } catch (error) {
    Logger.error(error)
    if (
      error &&
      error instanceof Error &&
      error.message &&
      error.message.startsWith('method not found')
    ) {
      return {
        jsonrpc: JsonRpc.Version,
        id: message.id,
        error: {
          code: JsonRpc.ErrorMethodNotFound,
          message: error.message,
          data: error.stack,
        },
      }
    }
    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      error: {
        // TODO actually check that error.message and error.stack exist
        // @ts-ignore
        message: error.message,
        data: {
          // @ts-ignore
          stack: error.stack,
        },
      },
    }
  }
}
