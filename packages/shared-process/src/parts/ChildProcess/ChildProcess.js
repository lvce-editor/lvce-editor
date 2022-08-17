import * as NodeChildProcess from 'node:child_process'
import { Worker } from 'node:worker_threads'
import exitHook from 'exit-hook'
import * as Debug from '../Debug/Debug.js'

export const state = {
  /** @type{ChildProcess[]} */
  childProcesses: [],
}

const cleanUpAll = () => {
  for (const childProcess of state.childProcesses) {
    childProcess.kill()
  }
}

const handleProcessExit = () => {
  Debug.debug('exiting')
  console.info('[shared process] exiting')
  cleanUpAll()
}

/**
 *
 * @param {string} path
 * @param {NodeChildProcess.ForkOptions } options
 * @returns
 */
export const fork = (path, argv, options) => {
  exitHook(handleProcessExit)
  const childProcess = NodeChildProcess.fork(path, argv, options)

  // childProcess.on('error', (error) => {
  //   onError(error)
  // })

  // childProcess.on('exit', (exitCode) => {
  //   onExit(exitCode)
  // })

  // childProcess.once('message', (message) => {
  //   if (message === 'ready') {
  //     onReady()
  //     childProcess.on('message', onMessage)
  //     // TODO remove jsonrpc part from here
  //     // childProcess.on('message', (message) => {
  //     //   // @ts-ignore
  //     //   if ('result' in message) {
  //     //     // @ts-ignore
  //     //     callbacks[message.id](message.result)
  //     //     // @ts-ignore
  //     //     delete callbacks[message.id]
  //     //   } else {
  //     //     onMessage(message)
  //     //   }
  //     // })
  //   }
  // })

  state.childProcesses.push(childProcess)

  return childProcess
}

export const disposeFork = (childProcess) => {
  childProcess.kill()
}

export const createWorker = (path, { onError, onExit, onMessage }) => {
  const worker = new Worker(path, {
    resourceLimits: {
      maxOldGenerationSizeMb: 10,
      maxYoungGenerationSizeMb: 10,
    },
  })

  worker.on('error', (error) => {
    onError(error)
  })

  worker.on('exit', (exitCode) => {
    onExit(exitCode)
  })

  worker.on('message', (message) => {
    onMessage(message)
  })

  return {
    dispose() {
      worker.terminate()
    },
    send(message) {
      worker.postMessage(message)
    },
    async invoke(commandId, ...args) {},
  }
}
