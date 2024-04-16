import * as ConnectIpc from '../ConnectIpc/ConnectIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

// TODO when shared process is a utility process
// can just send browserWindowPort to shared process
// else need proxy events through this process

export const handlePort = async (browserWindowPort, browserWindowId) => {
  const method = IpcParentType.ElectronUtilityProcess
  const sharedProcess = await SharedProcess.hydrate({
    method,
    env: {
      FOLDER: '',
    },
  })
  await ConnectIpc.connectIpc(method, sharedProcess, browserWindowPort, '', browserWindowId)
}
