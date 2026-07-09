export const state: any = {
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
  send(message: any): any {
    state.pendingMessages.push(message)
  },
}
