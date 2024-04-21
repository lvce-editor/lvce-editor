import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'
import { VError } from '../VError/VError.ts'

export const create = async ({ method, ...options }) => {
  try {
    const module = await IpcParentModule.getModule(method)
    // @ts-ignore
    const rawIpc = await module.create(options)
    // @ts-ignore
    const ipc = module.wrap(rawIpc)
    return ipc
  } catch (error) {
    throw new VError(error, `Failed to create ipc`)
  }
}
