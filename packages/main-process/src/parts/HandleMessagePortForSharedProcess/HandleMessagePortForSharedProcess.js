import * as AppWindowStates from '../AppWindowStates/AppWindowStates.cjs'
import * as ConnectIpc from '../ConnectIpc/ConnectIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Logger from '../Logger/Logger.cjs'
import * as Performance from '../Performance/Performance.cjs'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.cjs'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

const getFolder = (args) => {
  if (!args || !args._ || args._.length === 0) {
    return ''
  }
  return args._[0]
}

// TODO when shared process is a utility process
// can just send browserWindowPort to shared process
// else need proxy events through this process

/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
export const handlePort = async (event, browserWindowPort, type, name) => {
  const config = AppWindowStates.findByWebContentsId(event.sender.id)
  if (!config) {
    Logger.warn('port event - config expected')
    return
  }
  const folder = getFolder(config.parsedArgs)
  Performance.mark(PerformanceMarkerType.WillStartSharedProcess)
  const method = IpcParentType.ElectronUtilityProcess
  const sharedProcess = await SharedProcess.hydrate({
    method,
    env: {
      FOLDER: folder,
    },
  })
  await ConnectIpc.connectIpc(method, sharedProcess, browserWindowPort, folder, event.sender.id)
}
