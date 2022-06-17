const { fork, spawn } = require('child_process')
const { EventEmitter } = require('events')
const { Worker } = require('worker_threads')

const METHOD_FORK = 1
const METHOD_SPAWN = 2
const METHOD_WORKER = 3

/**
 * @type {number}
 */
const METHOD_PREFERRED = METHOD_WORKER

// TODO spawn seems to be much faster than fork for unknown reasons
// however fork is required for ipc

const createViaSpawn = (absolutePath, options) => {
  const child = spawn('node', [absolutePath], options)
  return child
}

const createViaFork = (absolutePath, options) => {
  const child = fork(absolutePath, options)
  return child
}

const createViaWorker = (absolutePath, options) => {
  const child = new Worker(absolutePath, options)
  return child
}

const createChild = (absolutePath, options) => {
  switch (METHOD_PREFERRED) {
    case METHOD_FORK:
      return createViaFork(absolutePath, options)
    case METHOD_SPAWN:
      return createViaSpawn(absolutePath, options)
    case METHOD_WORKER:
      return createViaWorker(absolutePath, options)
    default:
      throw new Error('unknown method')
  }
}

/**
 *
 * @param {string} path
 * @param {{stdio?: import('child_process').SpawnOptions['stdio'], env?:import('child_process').SpawnOptions['env']}} options
 * @returns
 */
exports.create = (path, options = {}) => {
  const child = createChild(path, options)
  const emitter = new EventEmitter()
  const handleExit = (...args) => {
    emitter.emit('exit', ...args)
  }
  child.on('exit', handleExit)
  const handleError = (...args) => {
    emitter.emit('error', ...args)
  }
  child.on('error', handleError)
  const handleDisconnect = (...args) => {
    emitter.emit('disconnect', ...args)
  }
  child.on('disconnect', handleDisconnect)
  const handleOtherMessages = (message) => {
    emitter.emit('message', message)
  }
  const handleFirstMessage = (message) => {
    if (message === 'ready') {
      emitter.emit('ready')
      child.on('message', handleOtherMessages)
    } else {
      emitter.emit('error', new Error('not ready'))
    }
  }
  child.once('message', handleFirstMessage)

  return {
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    kill: child.kill.bind(child),
    send: child.send ? child.send.bind(child) : undefined,
    stdout: child.stdout,
    stderr: child.stderr,
  }
}
