import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen()
  const ipc = module.wrap(rawIpc)
  return ipc
}
