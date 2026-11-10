import * as LaunchProcessExplorer from '../LaunchProcessExplorer/LaunchProcessExplorer.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
  refCount: 0,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    const ipcPromise = LaunchProcessExplorer.launchProcessExplorer()
    state.ipc = ipcPromise
    ipcPromise.then(
      (ipc) => {
        const handleClose = (): void => {
          // A late close from an old process must not invalidate its replacement.
          if (state.ipc !== ipcPromise) {
            return
          }
          state.ipc = undefined
          state.refCount = 0
        }
        if (ipc.addEventListener) {
          ipc.addEventListener('close', handleClose)
        } else {
          ipc.on('close', handleClose)
        }
      },
      () => {
        if (state.ipc === ipcPromise) {
          state.ipc = undefined
        }
      },
    )
  }
  return state.ipc
}

export const acquire = async (): Promise<any> => {
  state.refCount++
  try {
    return await getOrCreate()
  } catch (error) {
    decreaseRefCount()
    throw error
  }
}

const disposeLater = (ipcPromise: any): any => {
  setTimeout(async () => {
    try {
      const ipc = await ipcPromise
      await ipc.dispose()
    } catch {
      // ignore disposal errors
    }
  }, 0)
}

export const decreaseRefCount = (): any => {
  if (state.refCount > 0) {
    state.refCount--
  }
  if (state.refCount === 0) {
    const { ipc } = state
    state.ipc = undefined
    if (ipc) {
      disposeLater(ipc)
    }
  }
  return state.refCount
}
