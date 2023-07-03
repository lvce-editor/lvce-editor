import { createWriteStream, writeFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'
import * as ExtensionHost from '../ExtensionHost/ExtensionHost.js'
import * as Process from '../Process/Process.js'
import * as Timeout from '../Timeout/Timeout.js'

export const measureLatencyBetweenExtensionHostAndSharedProcess = async (socket, id) => {
  // TODO lazy load extension host
  const latency = await ExtensionHost.measureLatency()
  socket.send([/* callback */ id, /* latency */ latency])
}

export const measureLatencyBetweenSharedProcessAndRendererProcess = async (socket, id) => {
  // const start = performance.now()
  // await new Promise((resolve) => {
  //   const callbackId = Callback.register(resolve)
  //   socket.send(JSON.stringify([/* ping */ 1, /* callbackId */ callbackId]))
  // })
  // const end = performance.now()
  // const latency = end - start
  const latency = 200
  socket.send([/* callback */ id, /* latency */ latency])
}

export const sharedProcessStartupPerformance = () => {
  // TODO
  // performance.eventLoopUtilization
}

export const getNodeStartupTiming = () => {
  const {
    name,
    entryType,
    startTime,
    duration,
    // @ts-ignore
    nodeStart,
    v8Start,
    bootstrapComplete,
    environment,
    loopStart,
    loopExit,
    idleTime,
  } = performance.nodeTiming
  return {
    name,
    entryType,
    startTime,
    duration,
    nodeStart,
    v8Start,
    bootstrapComplete,
    environment,
    loopStart,
    loopExit,
    idleTime,
  }
}

export const sharedProcessMemoryUsage = () => {
  // TODO also print out number of watched files
  return Process.memoryUsage()
}

// TODO not sure if this is actually useful

/* istanbul ignore next */
export const allocateMemory = () => {
  const array = Array.from({ length: 1e7 }).fill('some string')
  globalThis.arr = array
}

/* istanbul ignore next */
export const crashSharedProcess = () => {
  Timeout.setTimeout(() => {
    throw new Error('oops')
  }, 0)
}

export const osStats = () => {
  // TODO stats
  // - os name
  // - uptime
  // - cpu usage
  // - ram usage
  // - cpu temperature
  // - network usage
}

/* istanbul ignore next */
export const createHeapSnapshot = async () => {
  const { getHeapSnapshot } = await import('node:v8')
  const { pipeline } = await import('node:stream/promises')
  await pipeline(
    getHeapSnapshot(),
    // TODO get tmp dir from env
    createWriteStream(`/tmp/vscode-${Date.now()}.heapsnapshot`)
  )
}

// require('inspector').open()
