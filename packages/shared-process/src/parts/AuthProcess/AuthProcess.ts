import * as LaunchAuthProcess from '../LaunchAuthProcess/LaunchAuthProcess.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchAuthProcess.launchAuthProcess()
  }
  return state.ipc
}
