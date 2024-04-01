import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'

export const create = async ({ method, ...options }) => {
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  return module.create(options)
}
