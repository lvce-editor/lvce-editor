export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
  /**
   * @type {any}
   */
  ptyHostPromise: undefined,
  /**
   * @type {any[]}
   */
  pendingMessages: [],
  send(message) {
    state.pendingMessages.push(message)
  },
}
