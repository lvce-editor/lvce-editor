import * as LaunchAuthProcess from '../LaunchAuthProcess/LaunchAuthProcess.ts'

export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const getOrCreate = async (): Promise<any> => {
  if (!state.ipc) {
    state.ipc = LaunchAuthProcess.launchAuthProcess()
  }
  return state.ipc
}
