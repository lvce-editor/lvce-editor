import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'

export const create = async ({ method, ...options }) => {
  const module = await IpcParentModule.getModule(method)
  const rawIpc = module.create(options)
  if (!options.wrap) {
    return rawIpc
  }
  // @ts-ignore
  const ipc = module.wrap(rawIpc)
  return ipc
}
