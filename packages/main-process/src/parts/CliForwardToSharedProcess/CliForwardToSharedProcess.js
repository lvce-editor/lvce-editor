const ElectronApp = require('../ElectronApp/ElectronApp.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')
const NodeWorker = require('../NodeWorker/NodeWorker.js')
const Platform = require('../Platform/Platform.js')

const handleCliArgs = async (parsedArgs) => {
  const sharedProcessPath = Platform.getSharedProcessPath()
  const worker = NodeWorker.create(sharedProcessPath, {
    argv: parsedArgs._,
  })
  worker.postMessage({ method: '' })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  switch (type) {
    case FirstNodeWorkerEventType.Error:
      throw event
    default:
      break
  }
  ElectronApp.quit()
}

exports.handleCliArgs = handleCliArgs
