import * as RpcParentType from '../RpcParentType/RpcParentType.ts'

export const getModule = (method) => {
  switch (method) {
    case RpcParentType.JsonRpc:
      return import('../RpcParentWithJsonRpc/RpcParentWithJsonRpc.ts')
    default:
      throw new Error('unexpected rpc type')
  }
}
