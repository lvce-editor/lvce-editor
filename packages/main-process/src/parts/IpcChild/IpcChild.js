const IpcChildModule = require('../IpcChildModule/IpcChildModule.js')

exports.listen = async ({ method, ...params }) => {
  const module = await IpcChildModule.getModule(method)
  // @ts-ignore
  const rawIpc = await module.listen(params)
  const ipc = module.wrap(rawIpc)
  return ipc
}
