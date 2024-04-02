const Two = "2.0";
const create$4 = (method, params) => {
  return {
    jsonrpc: Two,
    method,
    params
  };
};
var JsonRpcEvent = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  create: create$4
});
class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}
const getType = (value) => {
  switch (typeof value) {
    case "number":
      return "number";
    case "function":
      return "function";
    case "string":
      return "string";
    case "object":
      if (value === null) {
        return "null";
      }
      if (Array.isArray(value)) {
        return "array";
      }
      return "object";
    case "boolean":
      return "boolean";
    default:
      return "unknown";
  }
};
const number = (value) => {
  const type = getType(value);
  if (type !== "number") {
    throw new AssertionError("expected value to be of type number");
  }
};
const state$1 = {
  id: 0
};
const create$3 = () => {
  return ++state$1.id;
};
const warn = (...args) => {
  console.warn(...args);
};
const withResolvers = () => {
  let _resolve;
  let _reject;
  const promise = new Promise((resolve2, reject) => {
    _resolve = resolve2;
    _reject = reject;
  });
  return {
    resolve: _resolve,
    reject: _reject,
    promise
  };
};
const state = {
  callbacks: Object.create(null)
};
const registerPromise = () => {
  const id = create$3();
  const {resolve: resolve2, promise} = withResolvers();
  state.callbacks[id] = resolve2;
  return {id, promise};
};
const resolve = (id, args) => {
  number(id);
  if (!(id in state.callbacks)) {
    console.log(args);
    warn(`callback ${id} may already be disposed`);
    return;
  }
  state.callbacks[id](args);
  delete state.callbacks[id];
};
const create$2 = (method, params) => {
  const {id, promise} = registerPromise();
  const message = {
    jsonrpc: Two,
    method,
    params,
    id
  };
  return {
    message,
    promise
  };
};
var JsonRpcRequest = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  create: create$2
});
class JsonRpcError extends Error {
  constructor(message) {
    super(message);
    this.name = "JsonRpcError";
  }
}
const DomException = "DOMException";
const ReferenceError$1 = "ReferenceError";
const SyntaxError$1 = "SyntaxError";
const TypeError$1 = "TypeError";
const getErrorConstructor = (message, type) => {
  if (type) {
    switch (type) {
      case DomException:
        return DOMException;
      case TypeError$1:
        return TypeError;
      case SyntaxError$1:
        return SyntaxError;
      case ReferenceError$1:
        return ReferenceError;
      default:
        return Error;
    }
  }
  if (message.startsWith("TypeError: ")) {
    return TypeError;
  }
  if (message.startsWith("SyntaxError: ")) {
    return SyntaxError;
  }
  if (message.startsWith("ReferenceError: ")) {
    return ReferenceError;
  }
  return Error;
};
const NewLine = "\n";
const getNewLineIndex = (string, startIndex = void 0) => {
  return string.indexOf(NewLine, startIndex);
};
const joinLines = (lines) => {
  return lines.join(NewLine);
};
const MethodNotFound = -32601;
const Custom = -32001;
const splitLines = (lines) => {
  return lines.split(NewLine);
};
const constructError = (message, type, name) => {
  const ErrorConstructor = getErrorConstructor(message, type);
  if (ErrorConstructor === DOMException && name) {
    return new ErrorConstructor(message, name);
  }
  if (ErrorConstructor === Error) {
    const error = new Error(message);
    if (name && name !== "VError") {
      error.name = name;
    }
    return error;
  }
  return new ErrorConstructor(message);
};
const getParentStack = (error) => {
  let parentStack = error.stack || error.data || error.message || "";
  if (parentStack.startsWith("    at")) {
    parentStack = error.message + NewLine + parentStack;
  }
  return parentStack;
};
const restoreJsonRpcError = (error) => {
  if (error && error instanceof Error) {
    return error;
  }
  const currentStack = joinLines(splitLines(new Error().stack).slice(1));
  if (error && error.code && error.code === MethodNotFound) {
    const restoredError = new JsonRpcError(error.message);
    const parentStack = getParentStack(error);
    restoredError.stack = parentStack + NewLine + currentStack;
    return restoredError;
  }
  if (error && error.message) {
    const restoredError = constructError(error.message, error.type, error.name);
    if (error.data) {
      if (error.data.stack && error.data.type && error.message) {
        restoredError.stack = error.data.type + ": " + error.message + NewLine + error.data.stack + NewLine + currentStack;
      } else if (error.data.stack) {
        restoredError.stack = error.data.stack;
      }
      if (error.data.codeFrame) {
        restoredError.codeFrame = error.data.codeFrame;
      }
      if (error.data.code) {
        restoredError.code = error.data.code;
      }
      if (error.data.type) {
        restoredError.name = error.data.type;
      }
    } else {
      if (error.stack) {
        const lowerStack = restoredError.stack || "";
        const indexNewLine = getNewLineIndex(lowerStack);
        const parentStack = getParentStack(error);
        restoredError.stack = parentStack + lowerStack.slice(indexNewLine);
      }
      if (error.codeFrame) {
        restoredError.codeFrame = error.codeFrame;
      }
    }
    return restoredError;
  }
  if (typeof error === "string") {
    return new Error(`JsonRpc Error: ${error}`);
  }
  return new Error(`JsonRpc Error: ${error}`);
};
const unwrapJsonRpcResult = (responseMessage) => {
  if ("error" in responseMessage) {
    const restoredError = restoreJsonRpcError(responseMessage.error);
    throw restoredError;
  }
  if ("result" in responseMessage) {
    return responseMessage.result;
  }
  throw new JsonRpcError("unexpected response message");
};
const create$1 = (message, error) => {
  return {
    jsonrpc: Two,
    id: message.id,
    error
  };
};
const E_COMMAND_NOT_FOUND = "E_COMMAND_NOT_FOUND";
const getErrorProperty = (error, prettyError) => {
  if (error && error.code === E_COMMAND_NOT_FOUND) {
    return {
      code: MethodNotFound,
      message: error.message,
      data: error.stack
    };
  }
  return {
    code: Custom,
    message: prettyError.message,
    data: {
      stack: prettyError.stack,
      codeFrame: prettyError.codeFrame,
      type: prettyError.type,
      code: prettyError.code
    }
  };
};
const getErrorResponse = (message, error, ipc, preparePrettyError, logError) => {
  const prettyError = preparePrettyError(error);
  logError(error, prettyError);
  const errorProperty = getErrorProperty(error, prettyError);
  return create$1(message, errorProperty);
};
const create = (message, result) => {
  return {
    jsonrpc: Two,
    id: message.id,
    result: result != null ? result : null
  };
};
const getSuccessResponse = (message, result) => {
  const resultProperty = result != null ? result : null;
  return create(message, resultProperty);
};
const getResponse = async (message, ipc, execute, preparePrettyError, logError, requiresSocket) => {
  try {
    const result = requiresSocket(message.method) ? await execute(message.method, ipc, ...message.params) : await execute(message.method, ...message.params);
    return getSuccessResponse(message, result);
  } catch (error) {
    return getErrorResponse(message, error, ipc, preparePrettyError, logError);
  }
};
const handleJsonRpcMessage = async (ipc, message, execute, resolve2, preparePrettyError, logError, requiresSocket) => {
  if ("id" in message) {
    if ("method" in message) {
      const response = await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket);
      try {
        ipc.send(response);
      } catch (error) {
        const errorResponse = getErrorResponse(message, error, ipc, preparePrettyError, logError);
        ipc.send(errorResponse);
      }
      return;
    }
    resolve2(message.id, message);
    return;
  }
  if ("method" in message) {
    await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket);
    return;
  }
  throw new JsonRpcError("unexpected message");
};
const send = (transport, method, ...params) => {
  const message = create$4(method, params);
  transport.send(message);
};
const invoke = async (ipc, method, ...params) => {
  const {message, promise} = create$2(method, params);
  ipc.send(message);
  const responseMessage = await promise;
  const result = unwrapJsonRpcResult(responseMessage);
  return result;
};
const invokeAndTransfer = async (ipc, handle, method, ...params) => {
  const {message, promise} = create$2(method, params);
  ipc.sendAndTransfer(message, handle);
  const responseMessage = await promise;
  const result = unwrapJsonRpcResult(responseMessage);
  return result;
};
export {JsonRpcEvent, JsonRpcRequest, getErrorResponse, getSuccessResponse, handleJsonRpcMessage, invoke, invokeAndTransfer, resolve, send};
export default null;
