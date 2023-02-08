const ElectronApp = require('../ElectronApp/ElectronApp.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')
const Platform = require('../Platform/Platform.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const WaitForIpcToExit = require('../WaitForIpcToExit/WaitForIpcToExit.js')

const handleCliArgs = async (parsedArgs) => {
  const sharedProcessPath = Platform.getSharedProcessPath()
  const ipc = await IpcParent.create({
    method: IpcParentType.NodeWorker,
    path: sharedProcessPath,
    argv: parsedArgs._,
  })
  ipc.send({ method: '' })
  const { type, event } = await WaitForIpcToExit.waitforIpcToExit(ipc)
  console.log({ type, event })
  switch (type) {
    case FirstNodeWorkerEventType.Error:
      throw event
    default:
      break
  }
  ElectronApp.quit()
}

exports.handleCliArgs = handleCliArgs
