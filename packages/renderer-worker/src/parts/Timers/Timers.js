import * as Command from '../Command/Command.js'

export const state = {
  /**
   * @type {any[]}
   */
  timeouts: [],
}

// TODO race condition
const handleTimeouts = async () => {
  for (const command of state.timeouts) {
    await Command.execute(command)
  }
  state.timeouts = []
}

export const setTimeout = (command, timeout) => {
  state.timeouts.push(command)
  globalThis.setTimeout(handleTimeouts, timeout)
}

export const clearTimeout = (timeout) => {
  globalThis.clearTimeout(timeout)
}
