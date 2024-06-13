import * as Rpc from '../Rpc/Rpc.ts'

/**
 *
 * @param {string} method
 * @param  {...any} params
 * @returns {Promise<any>}
 */
export const invoke = async (method: string, ...params: any[]) => {
  return Rpc.invoke(method, ...params)
}
