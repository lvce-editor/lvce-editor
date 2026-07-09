import * as LaunchEmbedsProcess from '../LaunchEmbedsProcess/LaunchEmbedsProcess.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async () => {
  if (!state.ipc) {
    state.ipc = LaunchEmbedsProcess.launchEmbedsProcess()
  }
  return state.ipc
}
