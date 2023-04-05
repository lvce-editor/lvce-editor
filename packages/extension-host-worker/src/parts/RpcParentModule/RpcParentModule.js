import * as RpcParentType from '../RpcParentType/RpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case RpcParentType.JsonRpc:
      return import('../RpcParentWithJsonRpc/RpcParentWithJsonRpc.js')
    default:
      throw new Error('unexpected rpc type')
  }
}
