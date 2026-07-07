import * as LaunchProcessExplorer from '../LaunchProcessExplorer/LaunchProcessExplorer.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
  refCount: 0,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchProcessExplorer.launchProcessExplorer()
  }
  return state.ipc
}

export const acquire = async () => {
  state.refCount++
  try {
    return await getOrCreate()
  } catch (error) {
    decreaseRefCount()
    throw error
  }
}

const disposeLater = (ipcPromise) => {
  setTimeout(async () => {
    try {
      const ipc = await ipcPromise
      await ipc.dispose()
    } catch {
      // ignore disposal errors
    }
  }, 0)
}

export const decreaseRefCount = () => {
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
