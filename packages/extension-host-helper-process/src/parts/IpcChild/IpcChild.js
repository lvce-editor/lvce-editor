import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method }) => {
  const module = await IpcChildModule.getModule(method)
  return module.listen()
}
