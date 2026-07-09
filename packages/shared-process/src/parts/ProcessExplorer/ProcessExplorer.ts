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
    state.ipc = LaunchProcessExplorer.launchProcessExplorer()
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
