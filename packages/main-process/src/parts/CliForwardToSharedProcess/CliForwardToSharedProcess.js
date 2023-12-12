import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as Exit from '../Exit/Exit.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'

export const handleCliArgs = async (parsedArgs) => {
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
    Exit.exit()
  }
}
