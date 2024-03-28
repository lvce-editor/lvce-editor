import * as LaunchTerminalWorker from '../LaunchTerminalWorker/LaunchTerminalWorker.js'

const state = {
  /**
   * @type {any}
   */
  worker: undefined,
}

export const getOrCreate = () => {
  state.worker ||= LaunchTerminalWorker.launchTerminalWorker()
  return state.worker
}
