const normalizeLine = line => {
  if (line.startsWith('Error: ')) {
    return line.slice('Error: '.length);
  }
  if (line.startsWith('VError: ')) {
    return line.slice('VError: '.length);
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
const NewLine$2 = '\n';
const getNewLineIndex$1 = (string, startIndex = undefined) => {
  return string.indexOf(NewLine$2, startIndex);
};
const mergeStacks = (parent, child) => {
  if (!child) {
    return parent;
  }
  const parentNewLineIndex = getNewLineIndex$1(parent);
  const childNewLineIndex = getNewLineIndex$1(child);
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
    this.name = 'VError';
    if (error instanceof Error) {
      this.stack = mergeStacks(this.stack, error.stack);
    }
    if (error.codeFrame) {
      // @ts-ignore
      this.codeFrame = error.codeFrame;
    }
    if (error.code) {
      // @ts-ignore
      this.code = error.code;
    }
  }
}

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}
const Object$1 = 1;
const Number = 2;
const Array$1 = 3;
const String = 4;
const Boolean = 5;
const Function = 6;
const Null = 7;
const Unknown = 8;
const getType = value => {
  switch (typeof value) {
    case 'number':
      return Number;
    case 'function':
      return Function;
    case 'string':
      return String;
    case 'object':
      if (value === null) {
        return Null;
      }
      if (Array.isArray(value)) {
        return Array$1;
      }
      return Object$1;
    case 'boolean':
      return Boolean;
    default:
      return Unknown;
  }
};
const string = value => {
  const type = getType(value);
  if (type !== String) {
    throw new AssertionError('expected value to be of type string');
  }
};

const isMessagePort = value => {
  return value && value instanceof MessagePort;
};
const isMessagePortMain = value => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain';
};
const isOffscreenCanvas = value => {
  return typeof OffscreenCanvas !== 'undefined' && value instanceof OffscreenCanvas;
};
const isInstanceOf = (value, constructorName) => {
  return value?.constructor?.name === constructorName;
};
const isSocket = value => {
  return isInstanceOf(value, 'Socket');
};
const transferrables = [isMessagePort, isMessagePortMain, isOffscreenCanvas, isSocket];
const isTransferrable = value => {
  for (const fn of transferrables) {
    if (fn(value)) {
      return true;
    }
  }
  return false;
};
const walkValue = (value, transferrables, isTransferrable) => {
  if (!value) {
    return;
  }
  if (isTransferrable(value)) {
    transferrables.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkValue(item, transferrables, isTransferrable);
    }
    return;
  }
  if (typeof value === 'object') {
    for (const property of Object.values(value)) {
      walkValue(property, transferrables, isTransferrable);
    }
    return;
  }
};
const getTransferrables = value => {
  const transferrables = [];
  walkValue(value, transferrables, isTransferrable);
  return transferrables;
};
const removeValues = (value, toRemove) => {
  if (!value) {
    return value;
  }
  if (Array.isArray(value)) {
    const newItems = [];
    for (const item of value) {
      if (!toRemove.includes(item)) {
        newItems.push(removeValues(item, toRemove));
      }
    }
    return newItems;
  }
  if (typeof value === 'object') {
    const newObject = Object.create(null);
    for (const [key, property] of Object.entries(value)) {
      if (!toRemove.includes(property)) {
        newObject[key] = removeValues(property, toRemove);
      }
    }
    return newObject;
  }
  return value;
};

// workaround for electron not supporting transferrable objects
// as parameters. If the transferrable object is a parameter, in electron
// only an empty objected is received in the main process
const fixElectronParameters = value => {
  const transfer = getTransferrables(value);
  const newValue = removeValues(value, transfer);
  return {
    newValue,
    transfer
  };
};
const getActualDataElectron = event => {
  const {
    data,
    ports
  } = event;
  if (ports.length === 0) {
    return data;
  }
  return {
    ...data,
    params: [...ports, ...data.params]
  };
};
const attachEvents = that => {
  const handleMessage = (...args) => {
    const data = that.getData(...args);
    that.dispatchEvent(new MessageEvent('message', {
      data
    }));
  };
  that.onMessage(handleMessage);
  const handleClose = event => {
    that.dispatchEvent(new Event('close'));
  };
  that.onClose(handleClose);
};
class Ipc extends EventTarget {
  constructor(rawIpc) {
    super();
    this._rawIpc = rawIpc;
    attachEvents(this);
  }
}
const E_INCOMPATIBLE_NATIVE_MODULE = 'E_INCOMPATIBLE_NATIVE_MODULE';
const E_MODULES_NOT_SUPPORTED_IN_ELECTRON = 'E_MODULES_NOT_SUPPORTED_IN_ELECTRON';
const ERR_MODULE_NOT_FOUND = 'ERR_MODULE_NOT_FOUND';
const NewLine$1 = '\n';
const joinLines$1 = lines => {
  return lines.join(NewLine$1);
};
const RE_AT = /^\s+at/;
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/;
const isNormalStackLine = line => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line);
};
const getDetails = lines => {
  const index = lines.findIndex(isNormalStackLine);
  if (index === -1) {
    return {
      actualMessage: joinLines$1(lines),
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
const splitLines$1 = lines => {
  return lines.split(NewLine$1);
};
const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/;
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/;
const isMessageCodeBlockStartIndex = line => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line);
};
const isMessageCodeBlockEndIndex = line => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line);
};
const getMessageCodeBlock = stderr => {
  const lines = splitLines$1(stderr);
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex);
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex);
  const relevantLines = lines.slice(startIndex, endIndex);
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length);
  return relevantMessage;
};
const isModuleNotFoundMessage = line => {
  return line.includes('[ERR_MODULE_NOT_FOUND]');
};
const getModuleNotFoundError = stderr => {
  const lines = splitLines$1(stderr);
  const messageIndex = lines.findIndex(isModuleNotFoundMessage);
  const message = lines[messageIndex];
  return {
    code: ERR_MODULE_NOT_FOUND,
    message
  };
};
const isModuleNotFoundError = stderr => {
  if (!stderr) {
    return false;
  }
  return stderr.includes('ERR_MODULE_NOT_FOUND');
};
const isModulesSyntaxError = stderr => {
  if (!stderr) {
    return false;
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module');
};
const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/;
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/;
const isUnhelpfulNativeModuleError = stderr => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr);
};
const getNativeModuleErrorMessage = stderr => {
  const message = getMessageCodeBlock(stderr);
  return {
    code: E_INCOMPATIBLE_NATIVE_MODULE,
    message: `Incompatible native node module: ${message}`
  };
};
const getModuleSyntaxError = () => {
  return {
    code: E_MODULES_NOT_SUPPORTED_IN_ELECTRON,
    message: `ES Modules are not supported in electron`
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
  const lines = splitLines$1(stderr);
  const {
    actualMessage,
    rest
  } = getDetails(lines);
  return {
    code: '',
    message: actualMessage,
    stack: rest
  };
};
class IpcError extends VError {
  // @ts-ignore
  constructor(betterMessage, stdout = '', stderr = '') {
    if (stdout || stderr) {
      // @ts-ignore
      const {
        code,
        message,
        stack
      } = getHelpfulChildProcessError(stdout, stderr);
      const cause = new Error(message);
      // @ts-ignore
      cause.code = code;
      cause.stack = stack;
      super(cause, betterMessage);
    } else {
      super(betterMessage);
    }
    // @ts-ignore
    this.name = 'IpcError';
    // @ts-ignore
    this.stdout = stdout;
    // @ts-ignore
    this.stderr = stderr;
  }
}
const listen$b = ({
  messagePort
}) => {
  if (!isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain');
  }
  return messagePort;
};
const signal$c = messagePort => {
  messagePort.start();
};
class IpcChildWithElectronMessagePort extends Ipc {
  getData = getActualDataElectron;
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixElectronParameters(message);
    this._rawIpc.postMessage(newValue, transfer);
  }
  dispose() {
    this._rawIpc.close();
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
  onClose(callback) {
    this._rawIpc.on('close', callback);
  }
}
const wrap$j = messagePort => {
  return new IpcChildWithElectronMessagePort(messagePort);
};
const IpcChildWithElectronMessagePort$1 = {
  __proto__: null,
  listen: listen$b,
  signal: signal$c,
  wrap: wrap$j
};

// @ts-ignore
const getUtilityProcessPortData = event => {
  const {
    data,
    ports
  } = event;
  if (ports.length === 0) {
    return data;
  }
  return {
    ...data,
    params: [...ports, ...data.params]
  };
};
const readyMessage = 'ready';
const listen$a = () => {
  // @ts-ignore
  const {
    parentPort
  } = process;
  if (!parentPort) {
    throw new IpcError('parent port must be defined');
  }
  return parentPort;
};
const signal$b = parentPort => {
  parentPort.postMessage(readyMessage);
};
class IpcChildWithElectronUtilityProcess extends Ipc {
  getData(event) {
    return getUtilityProcessPortData(event);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixElectronParameters(message);
    this._rawIpc.postMessage(newValue, transfer);
  }
  dispose() {
    this._rawIpc.close();
  }
  onClose(callback) {
    this._rawIpc.on('close', callback);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
}
const wrap$i = parentPort => {
  return new IpcChildWithElectronUtilityProcess(parentPort);
};
const IpcChildWithElectronUtilityProcess$1 = {
  __proto__: null,
  listen: listen$a,
  signal: signal$b,
  wrap: wrap$i
};
const getData$2 = event => {
  return event.data;
};
const listen$9 = () => {
  return globalThis;
};
const signal$a = global => {
  global.postMessage(readyMessage);
};
class IpcChildWithElectronWindow extends Ipc {
  getData(event) {
    return getData$2(event);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixElectronParameters(message);
    this._rawIpc.postMessage(newValue, location.origin, transfer);
  }
  dispose() {
    // ignore
  }
  onClose(callback) {
    // ignore
  }
  onMessage(callback) {
    const wrapped = event => {
      const {
        ports
      } = event;
      if (ports.length > 0) {
        return;
      }
      callback(event);
      this._rawIpc.removeEventListener('message', wrapped);
    };
    this._rawIpc.addEventListener('message', wrapped);
  }
}
const wrap$h = window => {
  return new IpcChildWithElectronWindow(window);
};
const IpcChildWithElectronWindow$1 = {
  __proto__: null,
  listen: listen$9,
  signal: signal$a,
  wrap: wrap$h
};
const listen$8 = ({
  port
}) => {
  return port;
};
const signal$9 = port => {
  port.postMessage(readyMessage);
};
class IpcChildWithMessagePort extends Ipc {
  getData(event) {
    return getData$2(event);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    // ignore
  }
  onClose(callback) {
    // ignore
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
    this._rawIpc.start();
  }
}
const wrap$g = port => {
  return new IpcChildWithMessagePort(port);
};
const IpcChildWithMessagePort$1 = {
  __proto__: null,
  listen: listen$8,
  signal: signal$9,
  wrap: wrap$g
};
const listen$7 = () => {
  // @ts-ignore
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new TypeError('module is not in web worker scope');
  }
  return globalThis;
};
const signal$8 = global => {
  global.postMessage(readyMessage);
};
class IpcChildWithModuleWorker extends Ipc {
  getData(event) {
    return getData$2(event);
  }
  send(message) {
    // @ts-ignore
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    // @ts-ignore
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    // ignore
  }
  onClose(callback) {
    // ignore
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
  }
}
const wrap$f = global => {
  return new IpcChildWithModuleWorker(global);
};
const waitForFirstMessage = async port => {
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  port.addEventListener('message', resolve, {
    once: true
  });
  const event = await promise;
  // @ts-ignore
  return event.data;
};
const listen$6 = async () => {
  const parentIpcRaw = listen$7();
  signal$8(parentIpcRaw);
  const parentIpc = wrap$f(parentIpcRaw);
  const firstMessage = await waitForFirstMessage(parentIpc);
  if (firstMessage.method !== 'initialize') {
    throw new IpcError('unexpected first message');
  }
  const type = firstMessage.params[0];
  if (type === 'message-port') {
    parentIpc.send({
      id: firstMessage.id,
      jsonrpc: '2.0',
      result: null
    });
    parentIpc.dispose();
    const port = firstMessage.params[1];
    return port;
  }
  return globalThis;
};
class IpcChildWithModuleWorkerAndMessagePort extends Ipc {
  getData(event) {
    return getData$2(event);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    if (this._rawIpc.close) {
      this._rawIpc.close();
    }
  }
  onClose(callback) {
    // ignore
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
    this._rawIpc.start();
  }
}
const wrap$e = port => {
  return new IpcChildWithModuleWorkerAndMessagePort(port);
};
const IpcChildWithModuleWorkerAndMessagePort$1 = {
  __proto__: null,
  listen: listen$6,
  wrap: wrap$e
};
const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [handle, ...message.params]
    };
  }
  return message;
};
const getTransferrablesNode = value => {
  const transferrables = getTransferrables(value);
  if (transferrables.length === 0) {
    throw new Error(`no transferrables found`);
  }
  return transferrables[0];
};
const listen$5 = async () => {
  if (!process.send) {
    throw new IpcError('process.send must be defined');
  }
  return process;
};
const signal$7 = process => {
  process.send(readyMessage);
};
class IpcChildWithNodeForkedProcess extends Ipc {
  getData(message, handle) {
    return getActualData(message, handle);
  }
  onClose(callback) {
    this._rawIpc.on('close', callback);
  }
  send(message) {
    this._rawIpc.send(message);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrablesNode(message);
    this._rawIpc.send(message, transfer);
  }
  dispose() {
    // ignore
  }
}
const wrap$d = process => {
  return new IpcChildWithNodeForkedProcess(process);
};
const IpcChildWithNodeForkedProcess$1 = {
  __proto__: null,
  listen: listen$5,
  signal: signal$7,
  wrap: wrap$d
};
const listen$3 = async () => {
  const {
    parentPort
  } = await import('node:worker_threads');
  if (!parentPort) {
    throw new IpcError('parentPort is required for node worker threads ipc');
  }
  return parentPort;
};
const signal$5 = parentPort => {
  parentPort.postMessage(readyMessage);
};
class IpcChildWithNodeWorker extends Ipc {
  getData(data) {
    return data;
  }
  onClose(callback) {
    this._rawIpc.on('close', callback);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrablesNode(message);
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    this._rawIpc.close();
  }
}
const wrap$b = parentPort => {
  return new IpcChildWithNodeWorker(parentPort);
};
const IpcChildWithNodeWorker$1 = {
  __proto__: null,
  listen: listen$3,
  signal: signal$5,
  wrap: wrap$b
};
const preloadChannelType = 'port';
const listen$2 = ({
  webContents
}) => {
  return webContents;
};
const getData$1 = (event, message) => {
  const {
    ports,
    sender
  } = event;
  const data = {
    ...message,
    params: [...message.params, ...ports, sender.id]
  };
  return data;
};
class IpcChildWithRendererProcess2 extends Ipc {
  getData(event, message) {
    return getData$1(event, message);
  }
  send(message) {
    this._rawIpc.postMessage(preloadChannelType, message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    this._rawIpc.postMessage(preloadChannelType, message, transfer);
  }
  dispose() {
    // ignore
  }
  onMessage(callback) {
    this._rawIpc.ipc.on(preloadChannelType, callback);
  }
  onClose(callback) {
    this._rawIpc.on('destroyed', callback);
  }
}
const wrap$a = webContents => {
  return new IpcChildWithRendererProcess2(webContents);
};
const IpcChildWithRendererProcess2$1 = {
  __proto__: null,
  listen: listen$2,
  wrap: wrap$a
};
const Error$3 = 1;
const Open = 2;
const Close = 3;
const addListener = (emitter, type, callback) => {
  if ('addEventListener' in emitter) {
    emitter.addEventListener(type, callback);
  } else {
    emitter.on(type, callback);
  }
};
const removeListener = (emitter, type, callback) => {
  if ('removeEventListener' in emitter) {
    emitter.removeEventListener(type, callback);
  } else {
    emitter.off(type, callback);
  }
};
const getFirstEvent = (eventEmitter, eventMap) => {
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  const listenerMap = Object.create(null);
  const cleanup = value => {
    for (const event of Object.keys(eventMap)) {
      removeListener(eventEmitter, event, listenerMap[event]);
    }
    resolve(value);
  };
  for (const [event, type] of Object.entries(eventMap)) {
    const listener = event => {
      cleanup({
        event,
        type
      });
    };
    addListener(eventEmitter, event, listener);
    listenerMap[event] = listener;
  }
  return promise;
};

// @ts-ignore
const getFirstWebSocketEvent = async webSocket => {
  // @ts-ignore
  const {
    WebSocket
  } = await import('ws');
  switch (webSocket.readyState) {
    case WebSocket.CLOSED:
      return {
        event: undefined,
        type: Close
      };
    case WebSocket.OPEN:
      return {
        event: undefined,
        type: Open
      };
  }
  // @ts-ignore
  const {
    event,
    type
  } = await getFirstEvent(webSocket, {
    close: Close,
    open: Open
  });
  return {
    event,
    type
  };
};

// @ts-ignore
const isWebSocketOpen = async webSocket => {
  // @ts-ignore
  const {
    WebSocket
  } = await import('ws');
  return webSocket.readyState === WebSocket.OPEN;
};

// @ts-ignore
const serialize = message => {
  return JSON.stringify(message);
};

// @ts-ignore
const deserialize = message => {
  return JSON.parse(message.toString());
};

// @ts-ignore
const handleUpgrade$1 = async (...args) => {
  const module = await Promise.resolve().then(function () { return index; });
  // @ts-ignore
  return module.handleUpgrade(...args);
};
const listen$1 = async ({
  handle,
  request
}) => {
  if (!request) {
    throw new IpcError('request must be defined');
  }
  if (!handle) {
    throw new IpcError('handle must be defined');
  }
  const webSocket = await handleUpgrade$1(request, handle);
  webSocket.pause();
  if (!(await isWebSocketOpen(webSocket))) {
    await getFirstWebSocketEvent(webSocket);
  }
  return webSocket;
};
const signal$4 = webSocket => {
  webSocket.resume();
};
const wrap$9 = webSocket => {
  return {
    dispose() {
      this.webSocket.close();
    },
    // @ts-ignore
    off(event, listener) {
      this.webSocket.off(event, listener);
    },
    // @ts-ignore
    on(event, listener) {
      switch (event) {
        case 'close':
          webSocket.on('close', listener);
          break;
        case 'message':
          // @ts-ignore
          const wrappedListener = message => {
            const data = deserialize(message);
            const event = {
              data,
              target: this
            };
            listener(event);
          };
          webSocket.on('message', wrappedListener);
          break;
        default:
          throw new Error('unknown event listener type');
      }
    },
    // @ts-ignore
    send(message) {
      const stringifiedMessage = serialize(message);
      this.webSocket.send(stringifiedMessage);
    },
    start() {
      throw new Error('start method is deprecated');
    },
    webSocket,
    /**
     * @type {any}
     */
    wrappedListener: undefined
  };
};
const IpcChildWithWebSocket = {
  __proto__: null,
  listen: listen$1,
  signal: signal$4,
  wrap: wrap$9
};
const Exit = 1;
const Error$2 = 2;
const Message$1 = 3;
const getFirstUtilityProcessEvent = async utilityProcess => {
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  let stdout = '';
  let stderr = '';
  const cleanup = value => {
    // @ts-ignore
    utilityProcess.stderr.off('data', handleStdErrData);
    // @ts-ignore
    utilityProcess.stdout.off('data', handleStdoutData);
    utilityProcess.off('message', handleMessage);
    utilityProcess.off('exit', handleExit);
    resolve(value);
  };
  const handleStdErrData = data => {
    stderr += data;
  };
  const handleStdoutData = data => {
    stdout += data;
  };
  const handleMessage = event => {
    cleanup({
      event,
      stderr,
      stdout,
      type: Message$1
    });
  };
  const handleExit = event => {
    cleanup({
      event,
      stderr,
      stdout,
      type: Exit
    });
  };
  // @ts-ignore
  utilityProcess.stderr.on('data', handleStdErrData);
  // @ts-ignore
  utilityProcess.stdout.on('data', handleStdoutData);
  utilityProcess.on('message', handleMessage);
  utilityProcess.on('exit', handleExit);
  const {
    event,
    type
  } = await promise;
  return {
    event,
    stderr,
    stdout,
    type
  };
};
const create$6$1 = async ({
  argv = [],
  env = process.env,
  execArgv = [],
  name,
  path
}) => {
  string(path);
  const actualArgv = ['--ipc-type=electron-utility-process', ...argv];
  const {
    utilityProcess
  } = await import('electron');
  const childProcess = utilityProcess.fork(path, actualArgv, {
    env,
    execArgv,
    serviceName: name,
    stdio: 'pipe'
  });
  const handleExit = () => {
    // @ts-ignore
    childProcess.stdout.unpipe(process.stdout);
    // @ts-ignore
    childProcess.stderr.unpipe(process.stderr);
  };
  childProcess.once('exit', handleExit);
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout);
  const {
    stderr,
    stdout,
    type
  } = await getFirstUtilityProcessEvent(childProcess);
  if (type === Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr);
  }
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr);
  return childProcess;
};
class IpcParentWithElectronUtilityProcess extends Ipc {
  getData(data) {
    return data;
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixElectronParameters(message);
    this._rawIpc.postMessage(newValue, transfer);
  }
  dispose() {
    this._rawIpc.kill();
  }
  onClose(callback) {
    this._rawIpc.on('exit', callback);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
}
const wrap$6 = process => {
  return new IpcParentWithElectronUtilityProcess(process);
};
const IpcParentWithElectronUtilityProcess$1 = {
  __proto__: null,
  create: create$6$1,
  wrap: wrap$6
};
const create$5$1 = async ({
  isMessagePortOpen,
  messagePort
}) => {
  if (!isMessagePort(messagePort)) {
    throw new IpcError('port must be of type MessagePort');
  }
  if (isMessagePortOpen) {
    return messagePort;
  }
  const eventPromise = getFirstEvent(messagePort, {
    message: Message$1
  });
  messagePort.start();
  const {
    event,
    type
  } = await eventPromise;
  if (type !== Message$1) {
    throw new IpcError('Failed to wait for ipc message');
  }
  if (event.data !== readyMessage) {
    throw new IpcError('unexpected first message');
  }
  return messagePort;
};
const signal$1 = messagePort => {
  messagePort.start();
};
class IpcParentWithMessagePort extends Ipc {
  getData = getData$2;
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    this._rawIpc.close();
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
  }
  onClose(callback) {}
}
const wrap$5 = messagePort => {
  return new IpcParentWithMessagePort(messagePort);
};
const IpcParentWithMessagePort$1 = {
  __proto__: null,
  create: create$5$1,
  signal: signal$1,
  wrap: wrap$5
};
const Message = 'message';
const Error$1 = 'error';
const getFirstWorkerEvent = worker => {
  return getFirstEvent(worker, {
    error: Error$1,
    message: Message
  });
};
const isErrorEvent = event => {
  return event instanceof ErrorEvent;
};
const getWorkerDisplayName = name => {
  if (!name) {
    return '<unknown> worker';
  }
  if (name.endsWith('Worker') || name.endsWith('worker')) {
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
    const stackLines = splitLines$1(this.stack || '');
    const relevantLines = stackLines.slice(1);
    const relevant = joinLines$1(relevantLines);
    this.stack = `${event.message}
    at Module (${event.filename}:${event.lineno}:${event.colno})
${relevant}`;
  }
}
const Module = 'module';
const create$4$1 = async ({
  name,
  url
}) => {
  const worker = new Worker(url, {
    name,
    type: Module
  });
  const {
    event,
    type
  } = await getFirstWorkerEvent(worker);
  switch (type) {
    case Message:
      if (event.data !== readyMessage) {
        throw new IpcError('unexpected first message from worker');
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
const getData = event => {
  // TODO why are some events not instance of message event?
  if (event instanceof MessageEvent) {
    return event.data;
  }
  return event;
};
class IpcParentWithModuleWorker extends Ipc {
  getData(event) {
    return getData(event);
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const transfer = getTransferrables(message);
    this._rawIpc.postMessage(message, transfer);
  }
  dispose() {
    // ignore
  }
  onClose(callback) {
    // ignore
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
  }
}
const wrap$4 = worker => {
  return new IpcParentWithModuleWorker(worker);
};
const IpcParentWithModuleWorker$1 = {
  __proto__: null,
  create: create$4$1,
  wrap: wrap$4
};
class ChildProcessError extends Error {
  // @ts-ignore
  constructor(stderr) {
    // @ts-ignore
    const {
      code,
      message,
      stack
    } = getHelpfulChildProcessError('', stderr);
    super(message || 'child process error');
    this.name = 'ChildProcessError';
    if (code) {
      // @ts-ignore
      this.code = code;
    }
    if (stack) {
      // @ts-ignore
      const lines = splitLines$1(this.stack);
      const [firstLine, ...stackLines] = lines;
      const newStackLines = [firstLine, ...stack, ...stackLines];
      const newStack = joinLines$1(newStackLines);
      this.stack = newStack;
    }
  }
}

// workaround for node not supporting transferrable objects
// as parameters. If the transferrable object is a parameter,
// it is received as a plain object is received in the receiving process
const fixNodeChildProcessParameters = value => {
  const transfer = getTransferrables(value);
  if (transfer.length === 0) {
    throw new IpcError('no transferrables found');
  }
  const newValue = removeValues(value, transfer);
  return {
    newValue,
    transfer: transfer[0]
  };
};
const getFirstNodeChildProcessEvent = async childProcess => {
  const {
    event,
    stderr,
    stdout,
    type
  } = await new Promise((resolve, reject) => {
    let stderr = '';
    let stdout = '';
    const cleanup = value => {
      if (childProcess.stdout && childProcess.stderr) {
        childProcess.stderr.off('data', handleStdErrData);
        childProcess.stdout.off('data', handleStdoutData);
      }
      childProcess.off('message', handleMessage);
      childProcess.off('exit', handleExit);
      childProcess.off('error', handleError);
      resolve(value);
    };
    const handleStdErrData = data => {
      stderr += data;
    };
    const handleStdoutData = data => {
      stdout += data;
    };
    const handleMessage = event => {
      cleanup({
        event,
        stderr,
        stdout,
        type: Message$1
      });
    };
    const handleExit = event => {
      cleanup({
        event,
        stderr,
        stdout,
        type: Exit
      });
    };
    const handleError = event => {
      cleanup({
        event,
        stderr,
        stdout,
        type: Error$2
      });
    };
    if (childProcess.stdout && childProcess.stderr) {
      childProcess.stderr.on('data', handleStdErrData);
      childProcess.stdout.on('data', handleStdoutData);
    }
    childProcess.on('message', handleMessage);
    childProcess.on('exit', handleExit);
    childProcess.on('error', handleError);
  });
  return {
    event,
    stderr,
    stdout,
    type
  };
};

// @ts-ignore
const create$2$1 = async ({
  argv = [],
  env,
  execArgv = [],
  name = 'child process',
  path,
  stdio = 'inherit'
}) => {
  try {
    string(path);
    const actualArgv = ['--ipc-type=node-forked-process', ...argv];
    const {
      fork
    } = await import('node:child_process');
    const childProcess = fork(path, actualArgv, {
      env,
      execArgv,
      stdio: 'pipe'
    });
    const {
      event,
      stderr,
      type
    } = await getFirstNodeChildProcessEvent(childProcess);
    if (type === Exit) {
      throw new ChildProcessError(stderr);
    }
    if (type === Error$2) {
      throw new IpcError(`child process had an error ${event}`);
    }
    if (stdio === 'inherit' && childProcess.stdout && childProcess.stderr) {
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);
    }
    return childProcess;
  } catch (error) {
    throw new VError(error, `Failed to launch ${name}`);
  }
};
class IpcParentWithNodeForkedProcess extends Ipc {
  constructor(childProcess) {
    super(childProcess);
    this.pid = childProcess.pid;
  }
  getData(message) {
    return message;
  }
  send(message) {
    this._rawIpc.send(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixNodeChildProcessParameters(message);
    this._rawIpc.send(newValue, transfer);
  }
  dispose() {
    this._rawIpc.kill();
  }
  onClose(callback) {
    this._rawIpc.on('close', callback);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
}
const wrap$2 = childProcess => {
  return new IpcParentWithNodeForkedProcess(childProcess);
};
const IpcParentWithNodeForkedProcess$1 = {
  __proto__: null,
  create: create$2$1,
  wrap: wrap$2
};
const fixNodeWorkerParameters = value => {
  const transfer = getTransferrables(value);
  if (transfer.length === 0) {
    throw new IpcError('no transferrables found');
  }
  return {
    newValue: value,
    transfer: transfer
  };
};
const getFirstNodeWorkerEvent = worker => {
  return getFirstEvent(worker, {
    error: Error$2,
    exit: Exit,
    message: Message$1
  });
};
const create$1$2 = async ({
  argv = [],
  env = process.env,
  execArgv = [],
  name,
  path,
  stdio
}) => {
  string(path);
  const actualArgv = ['--ipc-type=node-worker', ...argv];
  const actualEnv = {
    ...env,
    ELECTRON_RUN_AS_NODE: '1'
  };
  const ignoreStdio = stdio === 'inherit' ? undefined : true;
  const {
    Worker
  } = await import('node:worker_threads');
  const worker = new Worker(path, {
    argv: actualArgv,
    env: actualEnv,
    execArgv,
    name,
    stderr: ignoreStdio,
    stdout: ignoreStdio
  });
  const {
    event,
    type
  } = await getFirstNodeWorkerEvent(worker);
  if (type === Exit) {
    throw new IpcError(`Worker exited before ipc connection was established`);
  }
  if (type === Error$2) {
    throw new IpcError(`Worker threw an error before ipc connection was established: ${event}`);
  }
  if (event !== readyMessage) {
    throw new IpcError('unexpected first message from worker');
  }
  return worker;
};
class IpcParentWithNodeWorker extends Ipc {
  getData(message) {
    return message;
  }
  send(message) {
    this._rawIpc.postMessage(message);
  }
  sendAndTransfer(message) {
    const {
      newValue,
      transfer
    } = fixNodeWorkerParameters(message);
    this._rawIpc.postMessage(newValue, transfer);
  }
  async dispose() {
    await this._rawIpc.terminate();
  }
  onClose(callback) {
    this._rawIpc.on('exit', callback);
  }
  onMessage(callback) {
    this._rawIpc.on('message', callback);
  }
}
const wrap$1 = worker => {
  return new IpcParentWithNodeWorker(worker);
};
const IpcParentWithNodeWorker$1 = {
  __proto__: null,
  create: create$1$2,
  wrap: wrap$1
};
const stringifyCompact = value => {
  return JSON.stringify(value);
};
const parse = content => {
  if (content === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new VError(error, 'failed to parse json');
  }
};
const waitForWebSocketToBeOpen = webSocket => {
  return getFirstEvent(webSocket, {
    close: Close,
    error: Error$3,
    open: Open
  });
};
const create$p = async ({
  webSocket
}) => {
  const firstWebSocketEvent = await waitForWebSocketToBeOpen(webSocket);
  if (firstWebSocketEvent.type === Error$3) {
    throw new IpcError(`WebSocket connection error`);
  }
  if (firstWebSocketEvent.type === Close) {
    throw new IpcError('Websocket connection was immediately closed');
  }
  return webSocket;
};
class IpcParentWithWebSocket extends Ipc {
  getData(event) {
    return parse(event.data);
  }
  send(message) {
    this._rawIpc.send(stringifyCompact(message));
  }
  sendAndTransfer(message) {
    throw new Error('sendAndTransfer not supported');
  }
  dispose() {
    this._rawIpc.close();
  }
  onClose(callback) {
    this._rawIpc.addEventListener('close', callback);
  }
  onMessage(callback) {
    this._rawIpc.addEventListener('message', callback);
  }
}
const wrap = webSocket => {
  return new IpcParentWithWebSocket(webSocket);
};
const IpcParentWithWebSocket$1 = {
  __proto__: null,
  create: create$p,
  wrap
};

const Two$1 = '2.0';
const callbacks = Object.create(null);
const get = id => {
  return callbacks[id];
};
const remove = id => {
  delete callbacks[id];
};
class JsonRpcError extends Error {
  constructor(message) {
    super(message);
    this.name = 'JsonRpcError';
  }
}
const NewLine = '\n';
const DomException = 'DOMException';
const ReferenceError$1 = 'ReferenceError';
const SyntaxError$1 = 'SyntaxError';
const TypeError$1 = 'TypeError';
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
  if (message.startsWith('TypeError: ')) {
    return TypeError;
  }
  if (message.startsWith('SyntaxError: ')) {
    return SyntaxError;
  }
  if (message.startsWith('ReferenceError: ')) {
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
    if (name && name !== 'VError') {
      error.name = name;
    }
    return error;
  }
  return new ErrorConstructor(message);
};
const joinLines = lines => {
  return lines.join(NewLine);
};
const splitLines = lines => {
  return lines.split(NewLine);
};
const getCurrentStack = () => {
  const stackLinesToSkip = 3;
  const currentStack = joinLines(splitLines(new Error().stack || '').slice(stackLinesToSkip));
  return currentStack;
};
const getNewLineIndex = (string, startIndex = undefined) => {
  return string.indexOf(NewLine, startIndex);
};
const getParentStack = error => {
  let parentStack = error.stack || error.data || error.message || '';
  if (parentStack.startsWith('    at')) {
    parentStack = error.message + NewLine + parentStack;
  }
  return parentStack;
};
const MethodNotFound = -32601;
const Custom = -32001;
const restoreJsonRpcError = error => {
  const currentStack = getCurrentStack();
  if (error && error instanceof Error) {
    if (typeof error.stack === 'string') {
      error.stack = error.stack + NewLine + currentStack;
    }
    return error;
  }
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
        restoredError.stack = error.data.type + ': ' + error.message + NewLine + error.data.stack + NewLine + currentStack;
      } else if (error.data.stack) {
        restoredError.stack = error.data.stack;
      }
      if (error.data.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.data.codeFrame;
      }
      if (error.data.code) {
        // @ts-ignore
        restoredError.code = error.data.code;
      }
      if (error.data.type) {
        // @ts-ignore
        restoredError.name = error.data.type;
      }
    } else {
      if (error.stack) {
        const lowerStack = restoredError.stack || '';
        // @ts-ignore
        const indexNewLine = getNewLineIndex(lowerStack);
        const parentStack = getParentStack(error);
        // @ts-ignore
        restoredError.stack = parentStack + lowerStack.slice(indexNewLine);
      }
      if (error.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.codeFrame;
      }
    }
    return restoredError;
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`);
  }
  return new Error(`JsonRpc Error: ${error}`);
};
const unwrapJsonRpcResult = responseMessage => {
  if ('error' in responseMessage) {
    const restoredError = restoreJsonRpcError(responseMessage.error);
    throw restoredError;
  }
  if ('result' in responseMessage) {
    return responseMessage.result;
  }
  throw new JsonRpcError('unexpected response message');
};
const warn = (...args) => {
  console.warn(...args);
};
const resolve = (id, response) => {
  const fn = get(id);
  if (!fn) {
    console.log(response);
    warn(`callback ${id} may already be disposed`);
    return;
  }
  fn(response);
  remove(id);
};
const E_COMMAND_NOT_FOUND = 'E_COMMAND_NOT_FOUND';
const getErrorType = prettyError => {
  if (prettyError && prettyError.type) {
    return prettyError.type;
  }
  if (prettyError && prettyError.constructor && prettyError.constructor.name) {
    return prettyError.constructor.name;
  }
  return undefined;
};
const isAlreadyStack = line => {
  return line.trim().startsWith('at ');
};
const getStack = prettyError => {
  const stackString = prettyError.stack || '';
  const newLineIndex = stackString.indexOf('\n');
  if (newLineIndex !== -1 && !isAlreadyStack(stackString.slice(0, newLineIndex))) {
    return stackString.slice(newLineIndex + 1);
  }
  return stackString;
};
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
      stack: getStack(prettyError),
      codeFrame: prettyError.codeFrame,
      type: getErrorType(prettyError),
      code: prettyError.code,
      name: prettyError.name
    }
  };
};
const create$1$1 = (id, error) => {
  return {
    jsonrpc: Two$1,
    id,
    error
  };
};
const getErrorResponse = (id, error, preparePrettyError, logError) => {
  const prettyError = preparePrettyError(error);
  logError(error, prettyError);
  const errorProperty = getErrorProperty(error, prettyError);
  return create$1$1(id, errorProperty);
};
const create$o = (message, result) => {
  return {
    jsonrpc: Two$1,
    id: message.id,
    result: result ?? null
  };
};
const getSuccessResponse = (message, result) => {
  const resultProperty = result ?? null;
  return create$o(message, resultProperty);
};
const getErrorResponseSimple = (id, error) => {
  return {
    jsonrpc: Two$1,
    id,
    error: {
      code: Custom,
      // @ts-ignore
      message: error.message,
      data: error
    }
  };
};
const getResponse = async (message, ipc, execute, preparePrettyError, logError, requiresSocket) => {
  try {
    const result = requiresSocket(message.method) ? await execute(message.method, ipc, ...message.params) : await execute(message.method, ...message.params);
    return getSuccessResponse(message, result);
  } catch (error) {
    if (ipc.canUseSimpleErrorResponse) {
      return getErrorResponseSimple(message.id, error);
    }
    return getErrorResponse(message.id, error, preparePrettyError, logError);
  }
};
const defaultPreparePrettyError = error => {
  return error;
};
const defaultLogError = () => {
  // ignore
};
const defaultRequiresSocket = () => {
  return false;
};
const defaultResolve = resolve;

// TODO maybe remove this in v6 or v7, only accept options object to simplify the code
const normalizeParams = args => {
  if (args.length === 1) {
    const options = args[0];
    return {
      ipc: options.ipc,
      message: options.message,
      execute: options.execute,
      resolve: options.resolve || defaultResolve,
      preparePrettyError: options.preparePrettyError || defaultPreparePrettyError,
      logError: options.logError || defaultLogError,
      requiresSocket: options.requiresSocket || defaultRequiresSocket
    };
  }
  return {
    ipc: args[0],
    message: args[1],
    execute: args[2],
    resolve: args[3],
    preparePrettyError: args[4],
    logError: args[5],
    requiresSocket: args[6]
  };
};
const handleJsonRpcMessage = async (...args) => {
  const options = normalizeParams(args);
  const {
    message,
    ipc,
    execute,
    resolve,
    preparePrettyError,
    logError,
    requiresSocket
  } = options;
  if ('id' in message) {
    if ('method' in message) {
      const response = await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket);
      try {
        ipc.send(response);
      } catch (error) {
        const errorResponse = getErrorResponse(message.id, error, preparePrettyError, logError);
        ipc.send(errorResponse);
      }
      return;
    }
    resolve(message.id, message);
    return;
  }
  if ('method' in message) {
    await getResponse(message, ipc, execute, preparePrettyError, logError, requiresSocket);
    return;
  }
  throw new JsonRpcError('unexpected message');
};

class CommandNotFoundError extends Error {
  constructor(command) {
    super(`Command not found ${command}`);
    this.name = 'CommandNotFoundError';
  }
}
const commands = Object.create(null);
const register = commandMap => {
  Object.assign(commands, commandMap);
};
const getCommand = key => {
  return commands[key];
};
const execute = (command, ...args) => {
  const fn = getCommand(command);
  if (!fn) {
    throw new CommandNotFoundError(command);
  }
  return fn(...args);
};

const Two = '2.0';
const create$n = (method, params) => {
  return {
    jsonrpc: Two,
    method,
    params
  };
};
const create$m = (id, method, params) => {
  const message = {
    id,
    jsonrpc: Two,
    method,
    params
  };
  return message;
};
let id = 0;
const create$l = () => {
  return ++id;
};

/* eslint-disable n/no-unsupported-features/es-syntax */

const registerPromise = map => {
  const id = create$l();
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  map[id] = resolve;
  return {
    id,
    promise
  };
};

// @ts-ignore
const invokeHelper = async (callbacks, ipc, method, params, useSendAndTransfer) => {
  const {
    id,
    promise
  } = registerPromise(callbacks);
  const message = create$m(id, method, params);
  if (useSendAndTransfer && ipc.sendAndTransfer) {
    ipc.sendAndTransfer(message);
  } else {
    ipc.send(message);
  }
  const responseMessage = await promise;
  return unwrapJsonRpcResult(responseMessage);
};
const createRpc = ipc => {
  const callbacks = Object.create(null);
  ipc._resolve = (id, response) => {
    const fn = callbacks[id];
    if (!fn) {
      console.warn(`callback ${id} may already be disposed`);
      return;
    }
    fn(response);
    delete callbacks[id];
  };
  const rpc = {
    async dispose() {
      await ipc?.dispose();
    },
    invoke(method, ...params) {
      return invokeHelper(callbacks, ipc, method, params, false);
    },
    invokeAndTransfer(method, ...params) {
      return invokeHelper(callbacks, ipc, method, params, true);
    },
    // @ts-ignore
    ipc,
    /**
     * @deprecated
     */
    send(method, ...params) {
      const message = create$n(method, params);
      ipc.send(message);
    }
  };
  return rpc;
};
const requiresSocket = () => {
  return false;
};
const preparePrettyError = error => {
  return error;
};
const logError = () => {
  // handled by renderer worker
};
const handleMessage = event => {
  const actualRequiresSocket = event?.target?.requiresSocket || requiresSocket;
  const actualExecute = event?.target?.execute || execute;
  return handleJsonRpcMessage(event.target, event.data, actualExecute, event.target._resolve, preparePrettyError, logError, actualRequiresSocket);
};
const handleIpc = ipc => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', handleMessage);
  } else if ('on' in ipc) {
    // deprecated
    ipc.on('message', handleMessage);
  }
};
const unhandleIpc = ipc => {
  if ('removeEventListener' in ipc) {
    ipc.removeEventListener('message', handleMessage);
  } else {
    // deprecated
    ipc.onmessage = null;
  }
};
const listen = async (module, options) => {
  const rawIpc = await module.listen(options);
  if (module.signal) {
    module.signal(rawIpc);
  }
  const ipc = module.wrap(rawIpc);
  return ipc;
};
const create$k = async ({
  commandMap,
  messagePort,
  requiresSocket
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithElectronMessagePort$1, {
    messagePort
  });
  if (requiresSocket) {
    ipc.requiresSocket = requiresSocket;
  }
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const ElectronMessagePortRpcClient = {
  __proto__: null,
  create: create$k
};
const create$j = async ({
  commandMap
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithElectronUtilityProcess$1);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const ElectronUtilityProcessRpcClient = {
  __proto__: null,
  create: create$j
};
const create$i = async ({
  argv,
  commandMap,
  env,
  execArgv,
  name,
  path,
  requiresSocket
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithElectronUtilityProcess$1.create({
    argv,
    env,
    execArgv,
    name,
    path
  });
  const ipc = IpcParentWithElectronUtilityProcess$1.wrap(rawIpc);
  if (requiresSocket) {
    // @ts-ignore
    ipc.requiresSocket = requiresSocket;
  }
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const ElectronUtilityProcessRpcParent = {
  __proto__: null,
  create: create$i
};
const create$h = async ({
  commandMap,
  requiresSocket,
  webContents
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = IpcChildWithRendererProcess2$1.wrap(webContents);
  if (requiresSocket) {
    // @ts-ignore
    ipc.requiresSocket = requiresSocket;
  }
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const ElectronWebContentsRpcClient = {
  __proto__: null,
  create: create$h
};
const create$g = async ({
  commandMap,
  window
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = IpcChildWithElectronWindow$1.wrap(window);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const ElectronWindowRpcClient = {
  __proto__: null,
  create: create$g
};
const create$f = async ({
  commandMap,
  messagePort
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithMessagePort$1, {
    port: messagePort
  });
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const MessagePortRpcClient = {
  __proto__: null,
  create: create$f
};
const create$e = async ({
  commandMap,
  isMessagePortOpen,
  messagePort
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithMessagePort$1.create({
    isMessagePortOpen,
    messagePort
  });
  const ipc = IpcParentWithMessagePort$1.wrap(rawIpc);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const MessagePortRpcParent = {
  __proto__: null,
  create: create$e
};

/**
 * @deprecated use createMockRpc instead
 */
const create$d = ({
  commandMap,
  invoke,
  invokeAndTransfer
}) => {
  const mockRpc = {
    invoke,
    invokeAndTransfer
  };
  return mockRpc;
};
const MockRpc = {
  __proto__: null,
  create: create$d
};
const isWorker = value => {
  return value instanceof Worker;
};
const create$c = async ({
  commandMap,
  name,
  url
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const worker = await IpcParentWithModuleWorker$1.create({
    name,
    url
  });
  if (!isWorker(worker)) {
    throw new Error(`worker must be of type Worker`);
  }
  const ipc = IpcParentWithModuleWorker$1.wrap(worker);
  handleIpc(ipc);
  const workerRpc = createRpc(ipc);
  return workerRpc;
};
const ModuleWorkerRpcParent = {
  __proto__: null,
  create: create$c
};
const create$b = async ({
  commandMap,
  name,
  port,
  url
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const worker = await IpcParentWithModuleWorker$1.create({
    name,
    url
  });
  if (!isWorker(worker)) {
    throw new Error(`worker must be of type Worker`);
  }
  const ipc = IpcParentWithModuleWorker$1.wrap(worker);
  handleIpc(ipc);
  const workerRpc = createRpc(ipc);
  await workerRpc.invokeAndTransfer('initialize', 'message-port', port);
  unhandleIpc(ipc);
  return workerRpc;
};
const ModuleWorkerWithMessagePortRpcParent = {
  __proto__: null,
  create: create$b
};
const create$a = async ({
  commandMap
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithNodeForkedProcess$1);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const NodeForkedProcessRpcClient = {
  __proto__: null,
  create: create$a
};
const create$9 = async ({
  argv,
  commandMap,
  env,
  execArgv,
  path,
  stdio
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithNodeForkedProcess$1.create({
    argv,
    env,
    execArgv,
    path,
    stdio
  });
  const ipc = IpcParentWithNodeForkedProcess$1.wrap(rawIpc);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const NodeForkedProcessRpcParent = {
  __proto__: null,
  create: create$9
};
const create$8 = async ({
  commandMap,
  handle,
  request,
  requiresSocket
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithWebSocket, {
    handle,
    request
  });
  if (requiresSocket) {
    ipc.requiresSocket = requiresSocket;
  }
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const NodeWebSocketRpcClient = {
  __proto__: null,
  create: create$8
};
const create$7 = async ({
  commandMap
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithNodeWorker$1);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const NodeWorkerRpcClient = {
  __proto__: null,
  create: create$7
};
const create$6 = async ({
  argv,
  commandMap,
  env,
  execArgv,
  path,
  stdio
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithNodeWorker$1.create({
    argv,
    env,
    execArgv,
    path,
    stdio
  });
  const ipc = IpcParentWithNodeWorker$1.wrap(rawIpc);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  // @ts-ignore
  rpc.stdout = ipc._rawIpc.stdout;
  // @ts-ignore
  rpc.stderr = ipc._rawIpc.stderr;
  // @ts-ignore
  return rpc;
};
const NodeWorkerRpcParent = {
  __proto__: null,
  create: create$6
};
const create$5 = async ({
  commandMap,
  isMessagePortOpen = true,
  messagePort
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithMessagePort$1.create({
    isMessagePortOpen,
    messagePort
  });
  const ipc = IpcParentWithMessagePort$1.wrap(rawIpc);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  messagePort.start();
  return rpc;
};
const PlainMessagePortRpc = {
  __proto__: null,
  create: create$5
};
const create$4 = async ({
  commandMap,
  messagePort
}) => {
  return create$5({
    commandMap,
    messagePort
  });
};
const PlainMessagePortRpcParent = {
  __proto__: null,
  create: create$4
};
const create$3 = async ({
  commandMap,
  isMessagePortOpen,
  send
}) => {
  const {
    port1,
    port2
  } = new MessageChannel();
  await send(port1);
  return create$5({
    commandMap,
    isMessagePortOpen,
    messagePort: port2
  });
};
const TransferMessagePortRpcParent = {
  __proto__: null,
  create: create$3
};
const create$2 = async ({
  commandMap,
  webSocket
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const rawIpc = await IpcParentWithWebSocket$1.create({
    webSocket
  });
  const ipc = IpcParentWithWebSocket$1.wrap(rawIpc);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const WebSocketRpcParent = {
  __proto__: null,
  create: create$2
};
const Https = 'https:';
const Ws = 'ws:';
const Wss = 'wss:';
const getWebSocketProtocol = locationProtocol => {
  return locationProtocol === Https ? Wss : Ws;
};
const getWebSocketUrl = (type, host, locationProtocol) => {
  const wsProtocol = getWebSocketProtocol(locationProtocol);
  return `${wsProtocol}//${host}/websocket/${type}`;
};
const getHost = () => {
  return location.host;
};
const getProtocol = () => {
  return location.protocol;
};
const create$1 = async ({
  commandMap,
  type
}) => {
  const host = getHost();
  const protocol = getProtocol();
  const wsUrl = getWebSocketUrl(type, host, protocol);
  const webSocket = new WebSocket(wsUrl);
  const rpc = await create$2({
    commandMap,
    webSocket
  });
  return rpc;
};
const WebSocketRpcParent2 = {
  __proto__: null,
  create: create$1
};
const create = async ({
  commandMap
}) => {
  // TODO create a commandMap per rpc instance
  register(commandMap);
  const ipc = await listen(IpcChildWithModuleWorkerAndMessagePort$1);
  handleIpc(ipc);
  const rpc = createRpc(ipc);
  return rpc;
};
const WebWorkerRpcClient = {
  __proto__: null,
  create
};
const createMockRpc = ({
  commandMap
}) => {
  const invocations = [];
  const invoke = (method, ...params) => {
    invocations.push([method, ...params]);
    const command = commandMap[method];
    if (!command) {
      throw new Error(`command ${method} not found`);
    }
    return command(...params);
  };
  const mockRpc = {
    invocations,
    invoke,
    invokeAndTransfer: invoke
  };
  return mockRpc;
};
const createWebWorkerRpcClient = create;
const mockWebSocketRpc = () => {
  const originalLocation = globalThis.location;
  const originalWebSocket = globalThis.WebSocket;

  // @ts-ignore
  globalThis.location = {};
  // @ts-ignore
  globalThis.WebSocket = class {
    addEventListener(event, fn) {
      if (event === 'open') {
        fn();
      }
    }
    removeEventListener() {}
  };
  return {
    dispose() {
      globalThis.location = originalLocation;
      globalThis.WebSocket = originalWebSocket;
    }
  };
};
const mockWorkerGlobalRpc = () => {
  const originalOnMessage = globalThis.onmessage;
  const originalPostMessage = globalThis.postMessage;
  const originalWorkerGlobalScope = globalThis.WorkerGlobalScope;
  const originalAddEventListener = globalThis.addEventListener;
  let onMessageListener;

  // Set up the onmessage handler
  globalThis.onmessage = event => {
    if (onMessageListener) {
      onMessageListener(event);
    }
  };

  // Mock addEventListener to capture the listener
  globalThis.addEventListener = (type, listener) => {
    if (type === 'message') {
      onMessageListener = listener;
    }
  };
  globalThis.postMessage = () => {};

  // @ts-ignore
  globalThis.WorkerGlobalScope = {};
  const {
    port1,
    port2
  } = new MessageChannel();
  return {
    dispose() {
      port1.close();
      port2.close();
      globalThis.onmessage = originalOnMessage;
      globalThis.postMessage = originalPostMessage;
      globalThis.WorkerGlobalScope = originalWorkerGlobalScope;
      globalThis.addEventListener = originalAddEventListener;
    },
    start() {
      const messageEvent = new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          method: 'initialize',
          params: ['message-port', port2]
        },
        ports: [port2]
      });
      if (onMessageListener) {
        onMessageListener(messageEvent);
      }
    }
  };
};

const createWebSocketServer = async () => {
  const _ws = await import('ws');
  // workaround for jest or node bug
  const WebSocketServer = _ws.WebSocketServer ? _ws.WebSocketServer :
  // @ts-ignore
  _ws.default.WebSocketServer;
  const webSocketServer = new WebSocketServer({
    noServer: true

    // TODO not sure if ws compress is working at all
    // perMessageDeflate: true
  });
  return webSocketServer;
};
const doSocketUpgrade = (webSocketServer, request, socket) => {
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), resolve);
  return promise;
};
const handleUpgrade = async (request, socket) => {
  const webSocketServer = await createWebSocketServer();
  const webSocket = await doSocketUpgrade(webSocketServer, request, socket);
  return webSocket;
};

const index = {
  __proto__: null,
  handleUpgrade
};

export { ElectronMessagePortRpcClient, ElectronUtilityProcessRpcClient, ElectronUtilityProcessRpcParent, ElectronWebContentsRpcClient, ElectronWindowRpcClient, MessagePortRpcClient, MessagePortRpcParent, MockRpc, ModuleWorkerRpcParent, ModuleWorkerWithMessagePortRpcParent, NodeForkedProcessRpcClient, NodeForkedProcessRpcParent, NodeWebSocketRpcClient, NodeWorkerRpcClient, NodeWorkerRpcParent, PlainMessagePortRpc, PlainMessagePortRpcParent, TransferMessagePortRpcParent, WebSocketRpcParent, WebSocketRpcParent2, WebWorkerRpcClient, createMockRpc, createWebWorkerRpcClient, mockWebSocketRpc, mockWorkerGlobalRpc };
