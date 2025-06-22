import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method, ...params }) => {
  const create = IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await create(params)
  return rpc
}
