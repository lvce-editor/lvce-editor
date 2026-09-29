export const state: any = {
  /**
   * @type {any}
   */
  ipc: undefined,
  /**
   * @type {any[]}
   */
  pendingMessages: [],
  /**
   * @type {any}
   */
  ptyHostPromise: undefined,
  send(message: any): any {
    state.pendingMessages.push(message)
  },
}
