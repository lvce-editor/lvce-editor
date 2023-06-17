import * as IpcParentModule from '../IpcParentModule/IpcParentModule.js'
import { VError } from '../VError/VError.js'

export const create = async ({ method, ...options }) => {
  try {
    const module = await IpcParentModule.getModule(method)
    // @ts-ignore
    const rawIpc = await module.create(options)
    const ipc = module.wrap(rawIpc)
    return ipc
  } catch (error) {
    throw new VError(error, `Failed to create ipc`)
  }
}
