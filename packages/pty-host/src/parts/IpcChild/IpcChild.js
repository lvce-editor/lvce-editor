import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen()
  const ipc = module.wrap(rawIpc)
  return ipc
}
