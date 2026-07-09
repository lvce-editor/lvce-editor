import * as LaunchEmbedsProcess from '../LaunchEmbedsProcess/LaunchEmbedsProcess.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    state.ipc = LaunchEmbedsProcess.launchEmbedsProcess()
  }
  return state.ipc
}
