// @ts-nocheck
const getData$1 = (event) => {
  return event.data;
};
const readyMessage = "ready";
const listen$2 = () => {
  if (typeof WorkerGlobalScope === "undefined") {
    throw new TypeError("module is not in web worker scope");
  }
  return globalThis;
};
const signal$1 = (global) => {
  global.postMessage(readyMessage);
};
const wrap$3 = (global) => {
  return {
    global,
    listener: void 0,
    send(message) {
      this.global.postMessage(message);
    },
    sendAndTransfer(message, transferables) {
      this.global.postMessage(message, transferables);
    },
    get onmessage() {
      return this.listener;
    },
    set onmessage(listener) {
      const wrappedListener = (event) => {
        const data = getData$1(event);
        listener({
          data,
          target: this
        });
      };
      this.listener = listener;
      this.global.onmessage = wrappedListener;
    },
    dispose() {
      this.listener = null;
      this.global.onmessage = null;
    }
  };
};
const IpcChildWithModuleWorker = {
  __proto__: null,
  listen: listen$2,
  signal: signal$1,
  wrap: wrap$3
};
const E_INCOMPATIBLE_NATIVE_MODULE = "E_INCOMPATIBLE_NATIVE_MODULE";
const E_MODULES_NOT_SUPPORTED_IN_ELECTRON = "E_MODULES_NOT_SUPPORTED_IN_ELECTRON";
const ERR_MODULE_NOT_FOUND = "ERR_MODULE_NOT_FOUND";
const NewLine$1 = "\n";
const joinLines = (lines) => {
  return lines.join(NewLine$1);
};
const splitLines = (lines) => {
  return lines.split(NewLine$1);
};
const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/;
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/;
const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/;
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/;
const RE_AT = /^\s+at/;
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/;
const isUnhelpfulNativeModuleError = (stderr) => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr);
};
const isMessageCodeBlockStartIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line);
};
const isMessageCodeBlockEndIndex = (line) => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line);
};
const getMessageCodeBlock = (stderr) => {
  const lines = splitLines(stderr);
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex);
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex);
  const relevantLines = lines.slice(startIndex, endIndex);
  const relevantMessage = relevantLines.join(" ").slice("Error: ".length);
  return relevantMessage;
};
const getNativeModuleErrorMessage = (stderr) => {
  const message = getMessageCodeBlock(stderr);
  return {
    message: `Incompatible native node module: ${message}`,
    code: E_INCOMPATIBLE_NATIVE_MODULE
  };
};
const isModulesSyntaxError = (stderr) => {
  if (!stderr) {
    return false;
  }
  return stderr.includes("SyntaxError: Cannot use import statement outside a module");
};
const getModuleSyntaxError = () => {
  return {
    message: `ES Modules are not supported in electron`,
    code: E_MODULES_NOT_SUPPORTED_IN_ELECTRON
  };
};
const isModuleNotFoundError = (stderr) => {
  if (!stderr) {
    return false;
  }
  return stderr.includes("ERR_MODULE_NOT_FOUND");
};
const isModuleNotFoundMessage = (line) => {
  return line.includes("ERR_MODULE_NOT_FOUND");
};
const getModuleNotFoundError = (stderr) => {
  const lines = splitLines(stderr);
  const messageIndex = lines.findIndex(isModuleNotFoundMessage);
  const message = lines[messageIndex];
  return {
    message,
    code: ERR_MODULE_NOT_FOUND
  };
};
const isNormalStackLine = (line) => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line);
};
const getDetails = (lines) => {
  const index = lines.findIndex(isNormalStackLine);
  if (index === -1) {
    return {
      actualMessage: joinLines(lines),
      rest: []
    };
  }
  let lastIndex = index - 1;
  while (++lastIndex < lines.length) {
    if (!isNormalStackLine(lines[lastIndex])) {
      break;
    }
  }
  return {
    actualMessage: lines[index - 1],
    rest: lines.slice(index, lastIndex)
  };
};
const getHelpfulChildProcessError = (stdout, stderr) => {
  if (isUnhelpfulNativeModuleError(stderr)) {
    return getNativeModuleErrorMessage(stderr);
  }
  if (isModulesSyntaxError(stderr)) {
    return getModuleSyntaxError();
  }
  if (isModuleNotFoundError(stderr)) {
    return getModuleNotFoundError(stderr);
  }
  const lines = splitLines(stderr);
  const {
    actualMessage,
    rest
  } = getDetails(lines);
  return {
    message: `${actualMessage}`,
    code: "",
    stack: rest
  };
};
const normalizeLine = (line) => {
  if (line.startsWith("Error: ")) {
    return line.slice(`Error: `.length);
  }
  if (line.startsWith("VError: ")) {
    return line.slice(`VError: `.length);
  }
  return line;
};
const getCombinedMessage = (error, message) => {
  const stringifiedError = normalizeLine(`${error}`);
  if (message) {
    return `${message}: ${stringifiedError}`;
  }
  return stringifiedError;
};
const NewLine = "\n";
const getNewLineIndex = (string, startIndex = void 0) => {
  return string.indexOf(NewLine, startIndex);
};
const mergeStacks = (parent, child) => {
  if (!child) {
    return parent;
  }
  const parentNewLineIndex = getNewLineIndex(parent);
  const childNewLineIndex = getNewLineIndex(child);
  if (childNewLineIndex === -1) {
    return parent;
  }
  const parentFirstLine = parent.slice(0, parentNewLineIndex);
  const childRest = child.slice(childNewLineIndex);
  const childFirstLine = normalizeLine(child.slice(0, childNewLineIndex));
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest;
  }
  return child;
};
class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message);
    super(combinedMessage);
    this.name = "VError";
    if (error instanceof Error) {
      this.stack = mergeStacks(this.stack, error.stack);
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame;
    }
    if (error.code) {
      this.code = error.code;
    }
  }
}
class IpcError extends VError {
  constructor(message, stdout = "", stderr = "") {
    if (stdout || stderr) {
      const {
        message: message2,
        code,
        stack
      } = getHelpfulChildProcessError(stdout, stderr);
      const cause = new Error(message2);
      cause.code = code;
      cause.stack = stack;
      super(cause, message2);
    } else {
      super(message);
    }
    this.name = "IpcError";
    this.stdout = stdout;
    this.stderr = stderr;
  }
}
const withResolvers = () => {
  let _resolve;
  const promise = new Promise((resolve) => {
    _resolve = resolve;
  });
  return {
    resolve: _resolve,
    promise
  };
};
const waitForFirstMessage = async (port) => {
  const {
    resolve,
    promise
  } = withResolvers();
  const cleanup = (value) => {
    port.onmessage = null;
    resolve(value);
  };
  const handleMessage = (event2) => {
    cleanup(event2);
  };
  port.onmessage = handleMessage;
  const event = await promise;
  return event.data;
};
const listen$1 = async () => {
  const parentIpcRaw = listen$2();
  signal$1(parentIpcRaw);
  const parentIpc = wrap$3(parentIpcRaw);
  const firstMessage = await waitForFirstMessage(parentIpc);
  if (firstMessage.method !== "initialize") {
    throw new IpcError("unexpected first message");
  }
  const type = firstMessage.params[0];
  if (type === "message-port") {
    parentIpc.dispose();
    const port = firstMessage.params[1];
    return port;
  }
  return globalThis;
};
const wrap$2 = (port) => {
  return {
    port,
    wrappedListener: void 0,
    send(message) {
      this.port.postMessage(message);
    },
    sendAndTransfer(message, transferables) {
      this.port.postMessage(message, transferables);
    },
    get onmessage() {
      return this.wrappedListener;
    },
    set onmessage(listener) {
      if (listener) {
        this.wrappedListener = (event) => {
          const data = getData$1(event);
          listener({
            data,
            target: this
          });
        };
      } else {
        this.wrappedListener = void 0;
      }
      this.port.onmessage = this.wrappedListener;
    }
  };
};
const IpcChildWithModuleWorkerAndMessagePort = {
  __proto__: null,
  listen: listen$1,
  wrap: wrap$2
};
const listen = () => {
  return window;
};
const signal = (global) => {
  global.postMessage(readyMessage);
};
const wrap$1 = (window2) => {
  return {
    window: window2,
    listener: void 0,
    get onmessage() {
      return this.listener;
    },
    set onmessage(listener) {
      this.listener = listener;
      const wrappedListener = (event) => {
        const data = event.data;
        if ("method" in data) {
          return;
        }
        listener({
          data,
          target: this
        });
      };
      this.window.onmessage = wrappedListener;
    },
    send(message) {
      this.window.postMessage(message);
    },
    sendAndTransfer(message, transfer) {
      this.window.postMessage(message, "*", transfer);
    },
    dispose() {
      this.window.onmessage = null;
      this.window = void 0;
      this.listener = void 0;
    }
  };
};
const IpcChildWithWindow = {
  __proto__: null,
  listen,
  signal,
  wrap: wrap$1
};
const Message = "message";
const Error$1 = "error";
const getFirstEvent = (eventEmitter, eventMap) => {
  const {
    resolve,
    promise
  } = withResolvers();
  const listenerMap = Object.create(null);
  const cleanup = (value) => {
    for (const event of Object.keys(eventMap)) {
      eventEmitter.off(event, listenerMap[event]);
    }
    resolve(value);
  };
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = (event2) => {
      cleanup({
        type,
        event: event2
      });
    };
    eventEmitter.on(event, listener);
    listenerMap[event] = listener;
  }
  return promise;
};
const getFirstWorkerEvent = (worker) => {
  return getFirstEvent(worker, {
    message: Message,
    error: Error$1
  });
};
const isErrorEvent = (event) => {
  return event instanceof ErrorEvent;
};
const getWorkerDisplayName = (name) => {
  if (!name) {
    return "<unknown> worker";
  }
  if (name.endsWith("Worker") || name.endsWith("worker")) {
    return name.toLowerCase();
  }
  return `${name} Worker`;
};
const tryToGetActualErrorMessage = async ({
  name
}) => {
  const displayName = getWorkerDisplayName(name);
  return `Failed to start ${displayName}: Worker Launch Error`;
};
class WorkerError extends Error {
  constructor(event) {
    super(event.message);
    const stackLines = splitLines(this.stack || "");
    const relevantLines = stackLines.slice(1);
    const relevant = joinLines(relevantLines);
    this.stack = `${event.message}
    at Module (${event.filename}:${event.lineno}:${event.colno})
${relevant}`;
  }
}
const Module = "module";
const create = async ({
  url,
  name
}) => {
  const worker = new Worker(url, {
    type: Module,
    name
  });
  const {
    type,
    event
  } = await getFirstWorkerEvent(worker);
  switch (type) {
    case Message:
      if (event.data !== readyMessage) {
        throw new IpcError("unexpected first message from worker");
      }
      break;
    case Error$1:
      if (isErrorEvent(event)) {
        throw new WorkerError(event);
      }
      const actualErrorMessage = await tryToGetActualErrorMessage({
        name
      });
      throw new Error(actualErrorMessage);
  }
  return worker;
};
const getData = (event) => {
  if (event instanceof MessageEvent) {
    return event.data;
  }
  return event;
};
const wrap = (worker) => {
  let handleMessage;
  return {
    get onmessage() {
      return handleMessage;
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          const data = getData(event);
          listener({
            data,
            target: this
          });
        };
      } else {
        handleMessage = null;
      }
      worker.onmessage = handleMessage;
    },
    send(message) {
      worker.postMessage(message);
    },
    sendAndTransfer(message, transfer) {
      worker.postMessage(message, transfer);
    }
  };
};
const IpcParentWithModuleWorker = {
  __proto__: null,
  create,
  wrap
};
export {IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithWindow, IpcParentWithModuleWorker};
export default null;
