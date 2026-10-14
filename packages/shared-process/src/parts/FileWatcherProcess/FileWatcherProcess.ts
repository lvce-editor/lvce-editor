import * as FileWatcher from '../FileWatcher/FileWatcher.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchFileWatcherProcess from '../LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts'

const closedConnections = new WeakSet<object>()

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
        closedConnections.add(ipc)
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
  if (closedConnections.has(ipc)) throw new Error('File watcher process disconnected')
  const events = ipc.addEventListener ? ipc : ipc.port || ipc
  const on = events.addEventListener ? events.addEventListener.bind(events) : events.on.bind(events)
  const off = events.removeEventListener ? events.removeEventListener.bind(events) : events.off.bind(events)
  let requestId: number | undefined
  let pending = true
  const fail = (error: Error): void => {
    if (!pending || requestId === undefined) return
    pending = false
    JsonRpc.resolve(requestId, { error })
  }
  const handleClose = (): void => fail(new Error('File watcher process disconnected'))
  const handleMessage = (event: any): void => {
    const message = event.data || event
    if (message.id === requestId && !message.method) pending = false
  }
  on('close', handleClose)
  on('message', handleMessage)
  try {
    return await JsonRpc.invoke(
      {
        send(message: any): void {
          requestId = message.id
          if (closedConnections.has(ipc)) {
            handleClose()
            return
          }
          try {
            ipc.send(message)
          } catch (error) {
            fail(error as Error)
          }
        },
      },
      method,
      ...params,
    )
  } finally {
    off('close', handleClose)
    off('message', handleMessage)
  }
}
