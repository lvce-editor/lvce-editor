declare module 'electron' {
  import type { EventEmitter } from 'node:events'

  interface IpcRenderer extends EventEmitter {
    readonly postMessage: (channelName: string, data: any, ports: Transferable[]) => void
  }

  interface ContextBridge {
    readonly exposeInMainWorld: (key: string, value: any) => void
  }

  export const ipcRenderer: IpcRenderer

  export const contextBridge: ContextBridge
}
