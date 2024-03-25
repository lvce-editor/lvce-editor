import * as RpcParentModule from '../RpcParentModule/RpcParentModule.js'

export const create = async ({ method, ...options }) => {
  const module = await RpcParentModule.getModule(method)
  // @ts-ignore
  const rpc = module.create(options)
  return rpc
}
