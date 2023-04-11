import * as RpcParentModule from '../RpcParentModule/RpcParentModule.js'
import { VError } from '../VError/VError.js'

export const create = async ({ method, ...options }) => {
  try {
    const module = await RpcParentModule.getModule(method)
    const rpc = module.create(options)
    return rpc
  } catch (error) {
    console.log({ error })
    throw new VError(error, `Failed to create rpc`)
  }
}
