import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'

export const create = async ({ method, ...options }) => {
  const module = await IpcParentModule.getModule(method)
  return module.create(options)
}
