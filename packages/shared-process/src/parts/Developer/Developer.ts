import * as MainProcess from '../MainProcess/MainProcess.ts'
import * as Process from '../Process/Process.ts'

export const measureLatencyBetweenExtensionHostAndSharedProcess = async (socket: any, id: any): Promise<any> => {
  // TODO lazy load extension host
  // @ts-ignore
  // const latency = await ExtensionHost.measureLatency()
  // socket.send([/* callback */ id, /* latency */ latency])
}

export const measureLatencyBetweenSharedProcessAndRendererProcess = async (socket: any, id: any): Promise<any> => {
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

export const sharedProcessStartupPerformance = (): any => {
  // TODO
  // performance.eventLoopUtilization
}

export const sharedProcessMemoryUsage = (): any => {
  // TODO also print out number of watched files
  return Process.memoryUsage()
}

export const showGpuInfo = (): any => {
  return MainProcess.invoke('ElectronWindowGpuInfo.open')
}

// TODO not sure if this is actually useful

/* istanbul ignore next */
export const allocateMemory = (): any => {
  const array = Array.from({ length: 1e7 }).fill('some string')
  ;(globalThis as any).arr = array
}

export const osStats = (): any => {
  // TODO stats
  // - os name
  // - uptime
  // - cpu usage
  // - ram usage
  // - cpu temperature
  // - network usage
}
