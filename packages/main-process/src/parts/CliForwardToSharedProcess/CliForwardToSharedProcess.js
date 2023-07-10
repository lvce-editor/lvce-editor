const ElectronApp = require('../ElectronApp/ElectronApp.cjs')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.cjs')
const ExitCode = require('../ExitCode/ExitCode.cjs')
const HandleIpc = require('../HandleIpc/HandleIpc.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')
const Platform = require('../Platform/Platform.cjs')
const Process = require('../Process/Process.cjs')

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
