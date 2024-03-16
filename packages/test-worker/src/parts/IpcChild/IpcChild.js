import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen()
  // @ts-ignore
  if (module.signal) {
    // @ts-ignore
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
