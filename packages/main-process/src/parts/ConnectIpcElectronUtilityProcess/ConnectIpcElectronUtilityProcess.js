const Callback = require('../Callback/Callback.js')

exports.connectIpc = async (sharedProcess, browserWindowPort, folder = '') => {
  const { id, promise } = Callback.registerPromise()
  sharedProcess.sendAndTransfer(
    {
      jsonrpc: '2.0',
      method: 'ElectronInitialize.electronInitialize',
      params: [],
      id,
    },
    [browserWindowPort]
  )
  await promise
}
