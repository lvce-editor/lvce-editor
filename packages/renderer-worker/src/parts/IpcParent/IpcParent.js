import * as GetExtensionHostSubWorkerUrl from '../GetExtensionHostSubWorkerUrl/GetExtensionHostSubWorkerUrl.js'
import * as IpcParentModule from '../IpcParentModule/IpcParentModule.js'

export const create = async ({ method, ...options }) => {
  // TODO
  if (options && options.url && options.url.endsWith('extensionHostSubWorkerMain.js')) {
    options.url = GetExtensionHostSubWorkerUrl.getExtensionHostSubWorkerUrl()
  }
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.create(options)
  if (options.noReturn) {
    return undefined
  }
  if (options.raw) {
    return rawIpc
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
