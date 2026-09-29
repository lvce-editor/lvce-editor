import * as IpcParentModule from '../IpcParentModule/IpcParentModule.ts'

export const create = async ({ method, ...options }: any): Promise<any> => {
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.create(options)
  // @ts-ignore
  const ipc = module.wrap(rawIpc)
  return ipc
}
