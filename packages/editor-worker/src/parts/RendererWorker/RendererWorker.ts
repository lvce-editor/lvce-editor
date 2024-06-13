import * as Rpc from '../Rpc/Rpc.ts'

/**
 *
 * @param {string} method
 * @param  {...any} params
 * @returns {Promise<any>}
 */
export const invoke = async (method, ...params) => {
  return Rpc.invoke(method, ...params)
}
