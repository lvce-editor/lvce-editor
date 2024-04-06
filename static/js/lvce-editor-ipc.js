/* SNOWPACK PROCESS POLYFILL (based on https://github.com/calvinmetcalf/node-process-es6) */
function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== 'undefined') {
    globalContext = window;
} else if (typeof self !== 'undefined') {
    globalContext = self;
} else {
    globalContext = {};
}
if (typeof globalContext.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = globalContext.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: {"NODE_ENV":"production"},
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

const E_INCOMPATIBLE_NATIVE_MODULE = 'E_INCOMPATIBLE_NATIVE_MODULE';
const E_MODULES_NOT_SUPPORTED_IN_ELECTRON = 'E_MODULES_NOT_SUPPORTED_IN_ELECTRON';
const ERR_MODULE_NOT_FOUND = 'ERR_MODULE_NOT_FOUND';

const NewLine$1 = '\n';

const joinLines = lines => {
  return lines.join(NewLine$1);
};

const splitLines = lines => {
  return lines.split(NewLine$1);
};

const RE_NATIVE_MODULE_ERROR = /^innerError Error: Cannot find module '.*.node'/;
const RE_NATIVE_MODULE_ERROR_2 = /was compiled against a different Node.js version/;
const RE_MESSAGE_CODE_BLOCK_START = /^Error: The module '.*'$/;
const RE_MESSAGE_CODE_BLOCK_END = /^\s* at/;
const RE_AT = /^\s+at/;
const RE_AT_PROMISE_INDEX = /^\s*at async Promise.all \(index \d+\)$/;
const isUnhelpfulNativeModuleError = stderr => {
  return RE_NATIVE_MODULE_ERROR.test(stderr) && RE_NATIVE_MODULE_ERROR_2.test(stderr);
};
const isMessageCodeBlockStartIndex = line => {
  return RE_MESSAGE_CODE_BLOCK_START.test(line);
};
const isMessageCodeBlockEndIndex = line => {
  return RE_MESSAGE_CODE_BLOCK_END.test(line);
};
const getMessageCodeBlock = stderr => {
  const lines = splitLines(stderr);
  const startIndex = lines.findIndex(isMessageCodeBlockStartIndex);
  const endIndex = startIndex + lines.slice(startIndex).findIndex(isMessageCodeBlockEndIndex, startIndex);
  const relevantLines = lines.slice(startIndex, endIndex);
  const relevantMessage = relevantLines.join(' ').slice('Error: '.length);
  return relevantMessage;
};
const getNativeModuleErrorMessage = stderr => {
  const message = getMessageCodeBlock(stderr);
  return {
    message: `Incompatible native node module: ${message}`,
    code: E_INCOMPATIBLE_NATIVE_MODULE
  };
};
const isModulesSyntaxError = stderr => {
  if (!stderr) {
    return false;
  }
  return stderr.includes('SyntaxError: Cannot use import statement outside a module');
};
const getModuleSyntaxError = () => {
  return {
    message: `ES Modules are not supported in electron`,
    code: E_MODULES_NOT_SUPPORTED_IN_ELECTRON
  };
};
const isModuleNotFoundError = stderr => {
  if (!stderr) {
    return false;
  }
  return stderr.includes('ERR_MODULE_NOT_FOUND');
};
const isModuleNotFoundMessage = line => {
  return line.includes('ERR_MODULE_NOT_FOUND');
};
const getModuleNotFoundError = stderr => {
  const lines = splitLines(stderr);
  const messageIndex = lines.findIndex(isModuleNotFoundMessage);
  const message = lines[messageIndex];
  return {
    message,
    code: ERR_MODULE_NOT_FOUND
  };
};
const isNormalStackLine = line => {
  return RE_AT.test(line) && !RE_AT_PROMISE_INDEX.test(line);
};
const getDetails = lines => {
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
    code: '',
    stack: rest
  };
};

const normalizeLine = line => {
  if (line.startsWith('Error: ')) {
    return line.slice(`Error: `.length);
  }
  if (line.startsWith('VError: ')) {
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
const NewLine = '\n';
const getNewLineIndex = (string, startIndex = undefined) => {
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

class IpcError extends VError {
  // @ts-ignore
  constructor(message, stdout = '', stderr = '') {
    if (stdout || stderr) {
      // @ts-ignore
      const {
        message,
        code,
        stack
      } = getHelpfulChildProcessError(stdout, stderr);
      const cause = new Error(message);
      // @ts-ignore
      cause.code = code;
      cause.stack = stack;
      super(cause, message);
    } else {
      super(message);
    }
    // @ts-ignore
    this.name = 'IpcError';
    // @ts-ignore
    this.stdout = stdout;
    // @ts-ignore
    this.stderr = stderr;
  }
}

const isMessagePortMain = value => {
  return value && value.constructor && value.constructor.name === 'MessagePortMain';
};

// @ts-ignore
const listen$5 = ({
  messagePort
}) => {
  if (!isMessagePortMain(messagePort)) {
    throw new IpcError('port must be of type MessagePortMain');
  }
  return messagePort;
};

// @ts-ignore
const getActualData$1 = event => {
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

// @ts-ignore
const wrap$8 = messagePort => {
  return {
    messagePort,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = event => {
          const actualData = getActualData$1(event);
          listener(actualData);
        };
        this.messagePort.on(event, wrappedListener);
      } else if (event === 'close') {
        this.messagePort.on('close', listener);
      } else {
        throw new Error('unsupported event type');
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.messagePort.off(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.messagePort.postMessage(message);
    },
    dispose() {
      this.messagePort.close();
    },
    start() {
      this.messagePort.start();
    }
  };
};

const IpcChildWithElectronMessagePort = {
  __proto__: null,
  listen: listen$5,
  wrap: wrap$8
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

const listen$4 = () => {
  // @ts-ignore
  const {
    parentPort
  } = process;
  if (!parentPort) {
    throw new Error('parent port must be defined');
  }
  return parentPort;
};

// @ts-ignore
const signal$2 = parentPort => {
  parentPort.postMessage('ready');
};

// @ts-ignore
const wrap$7 = parentPort => {
  return {
    parentPort,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = event => {
          const actualData = getUtilityProcessPortData(event);
          listener(actualData);
        };
        this.parentPort.on(event, wrappedListener);
      } else if (event === 'close') {
        this.parentPort.on('close', listener);
      } else {
        throw new Error('unsupported event type');
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.parentPort.off(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.parentPort.postMessage(message);
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      this.parentPort.postMessage(message, transfer);
    },
    dispose() {
      this.parentPort.close();
    }
  };
};

const IpcChildWithElectronUtilityProcess = {
  __proto__: null,
  listen: listen$4,
  signal: signal$2,
  wrap: wrap$7
};

const getData = event => {
  return event.data;
};

const listen$3 = () => {
  // @ts-ignore
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new TypeError('module is not in web worker scope');
  }
  // @ts-ignore
  globalThis.postMessage('ready');
  return globalThis;
};
const signal$1 = global => {
  global.postMessage('ready');
};
const wrap$6 = global => {
  return {
    global,
    /**
     * @type {any}
     */
    listener: undefined,
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
      const wrappedListener = event => {
        const data = getData(event);
        // @ts-expect-error
        listener({
          data,
          target: this
        });
      };
      this.listener = listener;
      this.global.onmessage = wrappedListener;
    }
  };
};

const IpcChildWithModuleWorker = {
  __proto__: null,
  listen: listen$3,
  signal: signal$1,
  wrap: wrap$6
};

const withResolvers = () => {
  let _resolve;
  const promise = new Promise(resolve => {
    _resolve = resolve;
  });
  return {
    resolve: _resolve,
    promise
  };
};

const waitForFirstMessage = async port => {
  const {
    resolve,
    promise
  } = withResolvers();
  const cleanup = value => {
    port.onmessage = null;
    resolve(value);
  };
  const handleMessage = event => {
    cleanup(event);
  };
  port.onmessage = handleMessage;
  const event = await promise;
  // @ts-expect-error
  return event.data;
};

const listen$2 = async () => {
  const parentIpcRaw = listen$3();
  const parentIpc = wrap$6(parentIpcRaw);
  const firstMessage = await waitForFirstMessage(parentIpc);
  if (firstMessage.method !== 'initialize') {
    throw new IpcError('unexpected first message');
  }
  const type = firstMessage.params[0];
  if (type === 'message-port') {
    const port = firstMessage.params[1];
    return port;
  }
  return globalThis;
};
const wrap$5 = port => {
  return {
    port,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
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
        // @ts-expect-error
        this.wrappedListener = event => {
          const data = getData(event);
          // @ts-expect-error
          listener({
            data,
            target: this
          });
        };
      } else {
        this.wrappedListener = undefined;
      }
      this.port.onmessage = this.wrappedListener;
    }
  };
};

const IpcChildWithModuleWorkerAndMessagePort = {
  __proto__: null,
  listen: listen$2,
  wrap: wrap$5
};

const listen$1 = async () => {
  if (!process.send) {
    throw new Error('process.send must be defined');
  }
  return process;
};

// @ts-ignore
const signal = process => {
  process.send('ready');
};

// @ts-ignore
const getActualData = (message, handle) => {
  if (handle) {
    return {
      ...message,
      params: [...message.params, handle]
    };
  }
  return message;
};

// @ts-ignore
const wrap$4 = process => {
  return {
    process,
    // @ts-ignore
    on(event, listener) {
      if (event === 'message') {
        // @ts-ignore
        const wrappedListener = (event, handle) => {
          const actualData = getActualData(event, handle);
          listener(actualData);
        };
        this.process.on(event, wrappedListener);
      } else if (event === 'close') {
        this.process.on('close', listener);
      } else {
        throw new Error('unsupported event type');
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.process.off(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.process.send(message);
    },
    dispose() {}
  };
};

const IpcChildWithNodeForkedProcess = {
  __proto__: null,
  listen: listen$1,
  signal,
  wrap: wrap$4
};

const Open = 1;
const Close = 2;

// @ts-ignore
const getFirstEvent = (eventEmitter, eventMap) => {
  const {
    resolve,
    promise
  } = withResolvers();
  const listenerMap = Object.create(null);
  // @ts-ignore
  const cleanup = value => {
    for (const event of Object.keys(eventMap)) {
      eventEmitter.off(event, listenerMap[event]);
    }
    // @ts-ignore
    resolve(value);
  };
  for (const [event, type] of Object.entries(eventMap)) {
    // @ts-ignore
    const listener = event => {
      cleanup({
        type,
        event
      });
    };
    eventEmitter.on(event, listener);
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
    case WebSocket.OPEN:
      return {
        type: Open,
        event: undefined
      };
    case WebSocket.CLOSED:
      return {
        type: Close,
        event: undefined
      };
  }
  // @ts-ignore
  const {
    type,
    event
  } = await getFirstEvent(webSocket, {
    open: Open,
    close: Close
  });
  return {
    type,
    event
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
const handleUpgrade = async (...args) => {
  const module = await import('@lvce-editor/web-socket-server');
  // @ts-ignore
  return module.handleUpgrade(...args);
};

// @ts-ignore
const listen = async ({
  request,
  handle
}) => {
  if (!request) {
    throw new IpcError('request must be defined');
  }
  if (!handle) {
    throw new IpcError('handle must be defined');
  }
  const webSocket = await handleUpgrade(request, handle);
  webSocket.pause();
  if (!(await isWebSocketOpen(webSocket))) {
    await getFirstWebSocketEvent(webSocket);
  }
  return webSocket;
};

// @ts-ignore
const wrap$3 = webSocket => {
  return {
    webSocket,
    /**
     * @type {any}
     */
    wrappedListener: undefined,
    // @ts-ignore
    on(event, listener) {
      switch (event) {
        case 'message':
          // @ts-ignore
          const wrappedListener = message => {
            const data = deserialize(message);
            listener(data);
          };
          webSocket.on('message', wrappedListener);
          break;
        case 'close':
          webSocket.on('close', listener);
          break;
        default:
          throw new Error('unknown event listener type');
      }
    },
    // @ts-ignore
    off(event, listener) {
      this.webSocket.off(event, listener);
    },
    // @ts-ignore
    send(message) {
      const stringifiedMessage = serialize(message);
      this.webSocket.send(stringifiedMessage);
    },
    dispose() {
      this.webSocket.close();
    },
    start() {
      this.webSocket.resume();
    }
  };
};

const IpcChildWithWebSocket = {
  __proto__: null,
  listen,
  wrap: wrap$3
};

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}
const getType = value => {
  switch (typeof value) {
    case 'number':
      return 'number';
    case 'function':
      return 'function';
    case 'string':
      return 'string';
    case 'object':
      if (value === null) {
        return 'null';
      }
      if (Array.isArray(value)) {
        return 'array';
      }
      return 'object';
    case 'boolean':
      return 'boolean';
    default:
      return 'unknown';
  }
};
const array = value => {
  const type = getType(value);
  if (type !== 'array') {
    throw new AssertionError('expected value to be of type array');
  }
};
const string = value => {
  const type = getType(value);
  if (type !== 'string') {
    throw new AssertionError('expected value to be of type string');
  }
};

const Exit = 1;
const Error$1 = 2;
const Message = 3;

/**
 *
 * @param {any} utilityProcess
 * @returns
 */
// @ts-ignore
const getFirstUtilityProcessEvent = async utilityProcess => {
  const {
    resolve,
    promise
  } = withResolvers();
  let stdout = '';
  let stderr = '';
  // @ts-ignore
  const cleanup = value => {
    // @ts-ignore
    utilityProcess.stderr.off('data', handleStdErrData);
    // @ts-ignore
    utilityProcess.stdout.off('data', handleStdoutData);
    utilityProcess.off('message', handleMessage);
    utilityProcess.off('exit', handleExit);
    // @ts-ignore
    resolve(value);
  };
  // @ts-ignore
  const handleStdErrData = data => {
    stderr += data;
  };
  // @ts-ignore
  const handleStdoutData = data => {
    stdout += data;
  };
  // @ts-ignore
  const handleMessage = event => {
    cleanup({
      type: Message,
      event,
      stdout,
      stderr
    });
  };
  // @ts-ignore
  const handleExit = event => {
    cleanup({
      type: Exit,
      event,
      stdout,
      stderr
    });
  };
  // @ts-ignore
  utilityProcess.stderr.on('data', handleStdErrData);
  // @ts-ignore
  utilityProcess.stdout.on('data', handleStdoutData);
  utilityProcess.on('message', handleMessage);
  utilityProcess.on('exit', handleExit);
  // @ts-ignore
  const {
    type,
    event
  } = await promise;
  return {
    type,
    event,
    stdout,
    stderr
  };
};

// @ts-ignore
const create$2 = async ({
  path,
  argv = [],
  execArgv = [],
  name
}) => {
  string(path);
  const actualArgv = ['--ipc-type=electron-utility-process', ...argv];
  // @ts-ignore
  const {
    utilityProcess
  } = await import('electron');
  const childProcess = utilityProcess.fork(path, actualArgv, {
    execArgv,
    stdio: 'pipe',
    serviceName: name
  });
  // @ts-ignore
  childProcess.stdout.pipe(process.stdout);
  const {
    type,
    event,
    stdout,
    stderr
  } = await getFirstUtilityProcessEvent(childProcess);
  if (type === Exit) {
    throw new IpcError(`Utility process exited before ipc connection was established`, stdout, stderr);
  }
  // @ts-ignore
  childProcess.stderr.pipe(process.stderr);
  return childProcess;
};

// @ts-ignore
const wrap$2 = process => {
  return {
    process,
    // @ts-ignore
    on(event, listener) {
      this.process.on(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.process.postMessage(message);
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      array(transfer);
      this.process.postMessage(message, transfer);
    },
    dispose() {
      this.process.kill();
    }
  };
};

const IpcParentWithElectronUtilityProcess = {
  __proto__: null,
  create: create$2,
  wrap: wrap$2
};

class ChildProcessError extends Error {
  // @ts-ignore
  constructor(stderr) {
    // @ts-ignore
    const {
      message,
      code,
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
      const lines = splitLines(this.stack);
      const [firstLine, ...stackLines] = lines;
      const newStackLines = [firstLine, ...stack, ...stackLines];
      const newStack = joinLines(newStackLines);
      this.stack = newStack;
    }
  }
}

// @ts-ignore
const getFirstNodeChildProcessEvent = async childProcess => {
  // @ts-ignore
  const {
    type,
    event,
    stdout,
    stderr
  } = await new Promise((resolve, reject) => {
    let stderr = '';
    let stdout = '';
    // @ts-ignore
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
    // @ts-ignore
    const handleStdErrData = data => {
      stderr += data;
    };
    // @ts-ignore
    const handleStdoutData = data => {
      stdout += data;
    };
    // @ts-ignore
    const handleMessage = event => {
      cleanup({
        type: Message,
        event,
        stdout,
        stderr
      });
    };
    // @ts-ignore
    const handleExit = event => {
      cleanup({
        type: Exit,
        event,
        stdout,
        stderr
      });
    };
    // @ts-ignore
    const handleError = event => {
      cleanup({
        type: Error$1,
        event,
        stdout,
        stderr
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
    type,
    event,
    stdout,
    stderr
  };
};

// @ts-ignore
const create$1 = async ({
  path,
  argv = [],
  env,
  execArgv = [],
  stdio = 'inherit',
  name = 'child process'
}) => {
  // @ts-ignore
  try {
    string(path);
    const actualArgv = ['--ipc-type=node-forked-process', ...argv];
    const {
      fork
    } = await import('node:node:child_process');
    const childProcess = fork(path, actualArgv, {
      env,
      execArgv,
      stdio: 'pipe'
    });
    const {
      type,
      event,
      stdout,
      stderr
    } = await getFirstNodeChildProcessEvent(childProcess);
    if (type === Exit) {
      throw new ChildProcessError(stderr);
    }
    if (type === Error$1) {
      throw new Error(`child process had an error ${event}`);
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

// @ts-ignore
const wrap$1 = childProcess => {
  return {
    childProcess,
    // @ts-ignore
    on(event, listener) {
      this.childProcess.on(event, listener);
    },
    // @ts-ignore
    off(event, listener) {
      this.childProcess.off(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.childProcess.send(message);
    },
    // @ts-ignore
    sendAndTransfer(message, handle) {
      this.childProcess.send(message, handle);
    },
    dispose() {
      this.childProcess.kill();
    },
    pid: childProcess.pid
  };
};

const IpcParentWithNodeForkedProcess = {
  __proto__: null,
  create: create$1,
  wrap: wrap$1
};

// @ts-ignore
const getFirstNodeWorkerEvent = worker => {
  return getFirstEvent(worker, {
    exit: Exit,
    error: Error$1
  });
};

// @ts-ignore
const create = async ({
  path,
  argv = [],
  env = process.env,
  execArgv = []
}) => {
  // @ts-ignore
  string(path);
  const actualArgv = ['--ipc-type=node-worker', ...argv];
  const actualEnv = {
    ...env,
    ELECTRON_RUN_AS_NODE: '1'
  };
  const {
    Worker
  } = await import('node:node:worker_threads');
  const worker = new Worker(path, {
    argv: actualArgv,
    env: actualEnv,
    execArgv
  });
  // @ts-ignore
  const {
    type,
    event
  } = await getFirstNodeWorkerEvent(worker);
  if (type === Exit) {
    throw new IpcError(`Worker exited before ipc connection was established`);
  }
  if (type === Error$1) {
    throw new IpcError(`Worker threw an error before ipc connection was established: ${event}`);
  }
  if (event !== 'ready') {
    throw new IpcError('unexpected first message from worker');
  }
  return worker;
};

// @ts-ignore
const wrap = worker => {
  return {
    worker,
    // @ts-ignore
    on(event, listener) {
      this.worker.on(event, listener);
    },
    // @ts-ignore
    send(message) {
      this.worker.postMessage(message);
    },
    // @ts-ignore
    sendAndTransfer(message, transfer) {
      array(transfer);
      this.worker.postMessage(message, transfer);
    },
    dispose() {
      this.worker.terminate();
    }
  };
};

const IpcParentWithNodeWorker = {
  __proto__: null,
  create,
  wrap
};

export { IpcChildWithElectronMessagePort, IpcChildWithElectronUtilityProcess, IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithNodeForkedProcess, IpcChildWithWebSocket, IpcParentWithElectronUtilityProcess, IpcParentWithNodeForkedProcess, IpcParentWithNodeWorker };

