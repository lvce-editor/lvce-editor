import * as Process from '../Process/Process.js'

export const measureLatencyBetweenExtensionHostAndSharedProcess = async (socket, id) => {
  // TODO lazy load extension host
  // @ts-ignore
  // const latency = await ExtensionHost.measureLatency()
  // socket.send([/* callback */ id, /* latency */ latency])
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

export const osStats = () => {
  // TODO stats
  // - os name
  // - uptime
  // - cpu usage
  // - ram usage
  // - cpu temperature
  // - network usage
}
