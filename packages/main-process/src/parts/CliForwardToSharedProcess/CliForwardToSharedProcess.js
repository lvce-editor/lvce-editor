const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')
const ExitCode = require('../ExitCode/ExitCode.js')
const HandleIpc = require('../HandleIpc/HandleIpc.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')
const Platform = require('../Platform/Platform.js')
const Process = require('../Process/Process.js')

const handleCliArgs = async (parsedArgs) => {
  try {
    const sharedProcessPath = Platform.getSharedProcessPath()
    const ipc = await IpcParent.create({
      method: IpcParentType.NodeWorker,
      path: sharedProcessPath,
    })
    HandleIpc.handleIpc(ipc)
    await JsonRpc.invoke(ipc, 'HandleCliArgs.handleCliArgs', parsedArgs)
  } catch (error) {
    Process.setExitCode(ExitCode.Error)
    if (error && error instanceof Error && error.stack && error.stack.includes('shared-process')) {
      // ignore
    } else {
      ErrorHandling.handleError(error)
    }
  } finally {
    ElectronApp.quit()
  }
}

exports.handleCliArgs = handleCliArgs
