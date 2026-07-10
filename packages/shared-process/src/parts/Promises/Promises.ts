export const withResolvers = (): any => {
  /**
   * @type {any}
   */
  let _resolve
  /**
   * @type {any}
   */
  let _reject
  const promise = new Promise((resolve: any, reject: any) => {
    _resolve = resolve
    _reject = reject
  })
  return {
    promise,
    reject: _reject,
    resolve: _resolve,
  }
}
