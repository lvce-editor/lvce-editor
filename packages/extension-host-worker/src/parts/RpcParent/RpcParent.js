import * as RpcParentModule from '../RpcParentModule/RpcParentModule.js'

export const create = async ({ method, ...options }) => {
  const module = await RpcParentModule.getModule(method)
  const rpc = module.create(options)
  return rpc
}
