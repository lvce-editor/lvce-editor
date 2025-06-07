// @ts-nocheck
const Two = '2.0'

const create$4 = (method, params) => {
  return {
    jsonrpc: Two,
    method,
    params,
  }
}

const JsonRpcEvent = {
  __proto__: null,
  create: create$4,
}

const callbacks = Object.create(null)
const set = (id, fn) => {
  callbacks[id] = fn
}
const get = (id) => {
  return callbacks[id]
}
const remove = (id) => {
  delete callbacks[id]
}

let id = 0
const create$3 = () => {
  return ++id
}

const registerPromise = () => {
  const id = create$3()
  const { resolve, promise } = Promise.withResolvers()
  set(id, resolve)
  return {
    id,
    promise,
  }
}

const create$2 = (method, params) => {
  const { id, promise } = registerPromise()
  const message = {
    jsonrpc: Two,
    method,
    params,
    id,
  }
  return {
    message,
    promise,
  }
}

const JsonRpcRequest = {
  __proto__: null,
  create: create$2,
}

class JsonRpcError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JsonRpcError'
  }
}

const NewLine = '\n'

const DomException = 'DOMException'
const ReferenceError$1 = 'ReferenceError'
const SyntaxError$1 = 'SyntaxError'
const TypeError$1 = 'TypeError'

const getErrorConstructor = (message, type) => {
  if (type) {
    switch (type) {
      case DomException:
        return DOMException
      case TypeError$1:
        return TypeError
      case SyntaxError$1:
        return SyntaxError
      case ReferenceError$1:
        return ReferenceError
      default:
        return Error
    }
  }
  if (message.startsWith('TypeError: ')) {
    return TypeError
  }
  if (message.startsWith('SyntaxError: ')) {
    return SyntaxError
  }
  if (message.startsWith('ReferenceError: ')) {
    return ReferenceError
  }
  return Error
}

const constructError = (message, type, name) => {
  const ErrorConstructor = getErrorConstructor(message, type)
  if (ErrorConstructor === DOMException && name) {
    return new ErrorConstructor(message, name)
  }
  if (ErrorConstructor === Error) {
    const error = new Error(message)
    if (name && name !== 'VError') {
      error.name = name
    }
    return error
  }
  return new ErrorConstructor(message)
}

const joinLines = (lines) => {
  return lines.join(NewLine)
}

const splitLines = (lines) => {
  return lines.split(NewLine)
}

const getCurrentStack = () => {
  const currentStack = joinLines(splitLines(new Error().stack || '').slice(2))
  return currentStack
}

const getNewLineIndex = (string, startIndex = undefined) => {
  return string.indexOf(NewLine, startIndex)
}

const getParentStack = (error) => {
  let parentStack = error.stack || error.data || error.message || ''
  if (parentStack.startsWith('    at')) {
    parentStack = error.message + NewLine + parentStack
  }
  return parentStack
}

const MethodNotFound = -32601
const Custom = -32001

const restoreJsonRpcError = (error) => {
  const currentStack = getCurrentStack()
  if (error && error instanceof Error) {
    if (typeof error.stack === 'string') {
      error.stack = error.stack + NewLine + currentStack
    }
    return error
  }
  if (error && error.code && error.code === MethodNotFound) {
    const restoredError = new JsonRpcError(error.message)
    const parentStack = getParentStack(error)
    restoredError.stack = parentStack + NewLine + currentStack
    return restoredError
  }
  if (error && error.message) {
    const restoredError = constructError(error.message, error.type, error.name)
    if (error.data) {
      if (error.data.stack && error.data.type && error.message) {
        restoredError.stack = error.data.type + ': ' + error.message + NewLine + error.data.stack + NewLine + currentStack
      } else if (error.data.stack) {
        restoredError.stack = error.data.stack
      }
      if (error.data.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.data.codeFrame
      }
      if (error.data.code) {
        // @ts-ignore
        restoredError.code = error.data.code
      }
      if (error.data.type) {
        // @ts-ignore
        restoredError.name = error.data.type
      }
    } else {
      if (error.stack) {
        const lowerStack = restoredError.stack || ''
        // @ts-ignore
        const indexNewLine = getNewLineIndex(lowerStack)
        const parentStack = getParentStack(error)
        // @ts-ignore
        restoredError.stack = parentStack + lowerStack.slice(indexNewLine)
      }
      if (error.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.codeFrame
      }
    }
    return restoredError
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  return new Error(`JsonRpc Error: ${error}`)
}

const unwrapJsonRpcResult = (responseMessage) => {
  if ('error' in responseMessage) {
    const restoredError = restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  throw new JsonRpcError('unexpected response message')
}

const warn = (...args) => {
  console.warn(...args)
}

const resolve = (id, response) => {
  const fn = get(id)
  if (!fn) {
    console.log(response)
    warn(`callback ${id} may already be disposed`)
    return
  }
  fn(response)
  remove(id)
}

const E_COMMAND_NOT_FOUND = 'E_COMMAND_NOT_FOUND'

const getErrorType = (prettyError) => {
  if (prettyError && prettyError.type) {
    return prettyError.type
  }
  if (prettyError && prettyError.constructor && prettyError.constructor.name) {
    return prettyError.constructor.name
  }
  return undefined
}

const isAlreadyStack = (line) => {
  return line.trim().startsWith('at ')
}
const getStack = (prettyError) => {
  const stackString = prettyError.stack || ''
  const newLineIndex = stackString.indexOf('\n')
  if (newLineIndex !== -1 && !isAlreadyStack(stackString.slice(0, newLineIndex))) {
    return stackString.slice(newLineIndex + 1)
  }
  return stackString
}
const getErrorProperty = (error, prettyError) => {
  if (error && error.code === E_COMMAND_NOT_FOUND) {
    return {
      code: MethodNotFound,
      message: error.message,
      data: error.stack,
    }
  }
  return {
    code: Custom,
    message: prettyError.message,
    data: {
      stack: getStack(prettyError),
      codeFrame: prettyError.codeFrame,
      type: getErrorType(prettyError),
      code: prettyError.code,
      name: prettyError.name,
    },
  }
}

const create$1 = (message, error) => {
  return {
    jsonrpc: Two,
    id: message.id,
    error,
  }
}

const getErrorResponse = (message, error, preparePrettyError, logError) => {
  const prettyError = preparePrettyError(error)
  logError(error, prettyError)
  const errorProperty = getErrorProperty(error, prettyError)
  return create$1(message, errorProperty)
}

const create = (message, result) => {
  return {
    jsonrpc: Two,
    id: message.id,
    result: result ?? null,
  }
}

const getSuccessResponse = (message, result) => {
  const resultProperty = result ?? null
  return create(message, resultProperty)
}

const getResponse = async (message, ipc, execute, preparePrettyError, logError, requiresSocket) => {
  try {
    const result = requiresSocket(message.method)
      ? await execute(message.method, ipc, ...message.params)
      : await execute(message.method, ...message.params)
    return getSuccessResponse(message, result)
  } catch (error) {
    return getErrorResponse(message, error, preparePrettyError, logError)
  }
}

const defaultPreparePrettyError = (error) => {
  return error
}
const defaultLogError = () => {
  // ignore
}
const defaultRequiresSocket = () => {
  return false
}
const defaultResolve = resolve

// TODO maybe remove this in v6 or v7, only accept options object to simplify the code
const normalizeParams = (args) => {
  if (args.length === 1) {
    const options = args[0]
    return {
      ipc: options.ipc,
      message: options.message,
      execute: options.execute,
      resolve: options.resolve || defaultResolve,
      preparePrettyError: options.preparePrettyError || defaultPreparePrettyError,
      logError: options.logError || defaultLogError,
      requiresSocket: options.requiresSocket || defaultRequiresSocket,
    }
  }
  return {
    ipc: args[0],
    message: args[1],
    execute: args[2],
    resolve: args[3],
    preparePrettyError: args[4],
    logError: args[5],
    requiresSocket: args[6],
  }
}

const handleJsonRpcMessage = async (...args) => {
  const options = normalizeParams(args)
  const { message, ipc, execute, resolve, preparePrettyError, logError, requiresSocket } = options
  if ('id' in message) {
    if ('method' in message) {
      const response = await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket)
      try {
        ipc.send(response)
      } catch (error) {
        const errorResponse = getErrorResponse(message, error, preparePrettyError, logError)
        ipc.send(errorResponse)
      }
      return
    }
    resolve(message.id, message)
    return
  }
  if ('method' in message) {
    await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket)
    return
  }
  throw new JsonRpcError('unexpected message')
}

const invokeHelper = async (ipc, method, params, useSendAndTransfer) => {
  const { message, promise } = create$2(method, params)
  if (useSendAndTransfer && ipc.sendAndTransfer) {
    ipc.sendAndTransfer(message)
  } else {
    ipc.send(message)
  }
  const responseMessage = await promise
  return unwrapJsonRpcResult(responseMessage)
}
const send = (transport, method, ...params) => {
  const message = create$4(method, params)
  transport.send(message)
}
const invoke = (ipc, method, ...params) => {
  return invokeHelper(ipc, method, params, false)
}
const invokeAndTransfer = (ipc, method, ...params) => {
  return invokeHelper(ipc, method, params, true)
}

export {
  JsonRpcEvent,
  JsonRpcRequest,
  getErrorResponse,
  getSuccessResponse,
  handleJsonRpcMessage,
  invoke,
  invokeAndTransfer,
  registerPromise,
  resolve,
  send,
}
