import * as LaunchProcessExplorer from '../LaunchProcessExplorer/LaunchProcessExplorer.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchProcessExplorer.launchProcessExplorer()
  }
  return state.ipc
}
