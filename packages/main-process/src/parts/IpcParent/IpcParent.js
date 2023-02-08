const IpcParentModule = require('../IpcParentModule/IpcParentModule.js')

exports.create = async ({ method, ...options }) => {
  const module = await IpcParentModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.create(options)
  const ipc = module.wrap(rawIpc)
  return ipc
}
