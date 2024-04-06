import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  const rawIpc = await module.listen()
  // @ts-expect-error
  if (module.signal) {
    // @ts-expect-error
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
