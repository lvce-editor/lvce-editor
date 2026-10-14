import * as FileWatcher from '../FileWatcher/FileWatcher.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchFileWatcherProcess from '../LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    const pending = LaunchFileWatcherProcess.launchFileWatcherProcess().then((ipc) => {
      const handleClose = (): void => {
        if (state.ipc !== pending) return
        state.ipc = undefined
        FileWatcher.handleProcessClose()
      }
      if (ipc.addEventListener) ipc.addEventListener('close', handleClose)
      else ipc.on('close', handleClose)
      return ipc
    })
    state.ipc = pending
    pending.catch(() => {
      if (state.ipc === pending) state.ipc = undefined
    })
  }
  return state.ipc
}

export const invoke = async (method: any, ...params: any): Promise<any> => {
  const ipc = await getOrCreate()
  return JsonRpc.invoke(ipc, method, ...params)
}
