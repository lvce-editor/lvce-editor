import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'

export const create = async ({ method, ...options }: { method: string; options: any }) => {
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.create(options)
  if (options.raw) {
    return rawIpc
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
