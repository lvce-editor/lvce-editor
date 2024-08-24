// @ts-nocheck
const Two = "2.0";
const create$4 = (method, params) => {
  return {
    jsonrpc: Two,
    method,
    params
  };
};
const JsonRpcEvent = {
  __proto__: null,
  create: create$4
};
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
  callbacks: Object.create(null)
};
const set = (id, fn) => {
  state$1.callbacks[id] = fn;
};
const get = (id) => {
  return state$1.callbacks[id];
};
const remove = (id) => {
  delete state$1.callbacks[id];
};
const state = {
  id: 0
};
const create$3 = () => {
  return ++state.id;
};
const warn = (...args) => {
  console.warn(...args);
};
const withResolvers = () => {
  let _resolve;
  const promise = new Promise((resolve2) => {
    _resolve = resolve2;
  });
  return {
    resolve: _resolve,
    promise
  };
};
const registerPromise = () => {
  const id = create$3();
  const {
    resolve: resolve2,
    promise
  } = withResolvers();
  set(id, resolve2);
  return {
    id,
    promise
  };
};
const resolve = (id, args) => {
  number(id);
  const fn = get(id);
  if (!fn) {
    console.log(args);
    warn(`callback ${id} may already be disposed`);
    return;
  }
  fn(args);
  remove(id);
};
const create$2 = (method, params) => {
  const {
    id,
    promise
  } = registerPromise();
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
const JsonRpcRequest = {
  __proto__: null,
  create: create$2
};
class JsonRpcError extends Error {
  constructor(message) {
    super(message);
    this.name = "JsonRpcError";
  }
}
const NewLine = "\n";
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
const getNewLineIndex = (string, startIndex = void 0) => {
  return string.indexOf(NewLine, startIndex);
};
const getParentStack = (error) => {
  let parentStack = error.stack || error.data || error.message || "";
  if (parentStack.startsWith("    at")) {
    parentStack = error.message + NewLine + parentStack;
  }
  return parentStack;
};
const joinLines = (lines) => {
  return lines.join(NewLine);
};
const MethodNotFound = -32601;
const Custom = -32001;
const splitLines = (lines) => {
  return lines.split(NewLine);
};
const restoreJsonRpcError = (error) => {
  if (error && error instanceof Error) {
    return error;
  }
  const currentStack = joinLines(splitLines(new Error().stack || "").slice(1));
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
const isMessagePort = (value) => {
  return typeof MessagePort !== "undefined" && value instanceof MessagePort;
};
const isInstanceOf = (value, constructorName) => {
  var _a;
  return ((_a = value == null ? void 0 : value.constructor) == null ? void 0 : _a.name) === constructorName;
};
const isMessagePortMain = (value) => {
  return isInstanceOf(value, "MessagePortMain");
};
const isOffscreenCanvas = (value) => {
  return typeof OffscreenCanvas !== "undefined" && value instanceof OffscreenCanvas;
};
const isSocket = (value) => {
  return isInstanceOf(value, "Socket");
};
const transferrables = [isMessagePort, isMessagePortMain, isOffscreenCanvas, isSocket];
const isTransferrable = (value) => {
  for (const fn of transferrables) {
    if (fn(value)) {
      return true;
    }
  }
  return false;
};
const walkValue = (value, transferrables2) => {
  if (!value) {
    return;
  }
  if (isTransferrable(value)) {
    transferrables2.push(value);
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkValue(item, transferrables2);
    }
    return;
  }
  if (typeof value === "object") {
    for (const property of Object.values(value)) {
      walkValue(property, transferrables2);
    }
  }
};
const getTransferrables = (value) => {
  const transferrables2 = [];
  walkValue(value, transferrables2);
  return transferrables2;
};
const isSingleTransferrable = (value) => {
  return isSocket(value);
};
const getTransferrableParams = (value) => {
  const transferrables2 = getTransferrables(value);
  if (transferrables2.length === 0) {
    return void 0;
  }
  if (isSingleTransferrable(transferrables2[0])) {
    return transferrables2[0];
  }
  return transferrables2;
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
const getErrorResponse = (message, error, preparePrettyError, logError) => {
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
    return getErrorResponse(message, error, preparePrettyError, logError);
  }
};
const defaultPreparePrettyError = (error) => {
  return error;
};
const defaultLogError = () => {
};
const defaultRequiresSocket = () => {
  return false;
};
const defaultResolve = resolve;
const handleJsonRpcMessage = async (...args) => {
  let message;
  let ipc;
  let execute;
  let preparePrettyError;
  let logError;
  let resolve2;
  let requiresSocket;
  if (args.length === 1) {
    const arg = args[0];
    message = arg.message;
    ipc = arg.ipc;
    execute = arg.execute;
    preparePrettyError = arg.preparePrettyError || defaultPreparePrettyError;
    logError = arg.logError || defaultLogError;
    requiresSocket = arg.requiresSocket || defaultRequiresSocket;
    resolve2 = arg.resolve || defaultResolve;
  } else {
    ipc = args[0];
    message = args[1];
    execute = args[2];
    resolve2 = args[3];
    preparePrettyError = args[4];
    logError = args[5];
    requiresSocket = args[6];
  }
  if ("id" in message) {
    if ("method" in message) {
      const response = await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket);
      try {
        ipc.send(response);
      } catch (error) {
        const errorResponse = getErrorResponse(message, error, preparePrettyError, logError);
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
  const {
    message,
    promise
  } = create$2(method, params);
  ipc.send(message);
  const responseMessage = await promise;
  const result = unwrapJsonRpcResult(responseMessage);
  return result;
};
const invokeAndTransfer = async (ipc, handle, method, ...params) => {
  let transfer = handle;
  if (typeof handle === "string") {
    params = [method, ...params];
    method = handle;
    transfer = getTransferrableParams(params);
  }
  const {
    message,
    promise
  } = create$2(method, params);
  ipc.sendAndTransfer(message, transfer);
  const responseMessage = await promise;
  const result = unwrapJsonRpcResult(responseMessage);
  return result;
};
export {JsonRpcEvent, JsonRpcRequest, getErrorResponse, getSuccessResponse, handleJsonRpcMessage, invoke, invokeAndTransfer, registerPromise, resolve, send};
export default null;
