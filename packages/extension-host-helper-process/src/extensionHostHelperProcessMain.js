import * as Command from './parts/Command/Command.js'
import * as CommandState from './parts/CommandState/CommandState.js'
import * as GetErrorResponse from './parts/GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from './parts/GetSuccessResponse/GetSuccessResponse.js'
import * as HandleIpc from './parts/HandleIpc/HandleIpc.js'
import * as ImportScript from './parts/ImportScript/ImportScript.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'

const waitForFirstMessage = async (ipc) => {
  const { message } = await new Promise((resolve) => {
    const cleanup = (value) => {
      ipc.off('message', handleMessage)
      resolve(value)
    }
    const handleMessage = (message) => {
      cleanup({ message })
    }
    ipc.on('message', handleMessage)
  })
  return message
}

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const firstMessage = await waitForFirstMessage(ipc)
  let module
  let execute = Command.execute
  try {
    module = await ImportScript.importScript(firstMessage.params[0])
    if (module && module.commandMap) {
      const commandMap = module.commandMap
      CommandState.registerCommands(commandMap)
    } else if (module && module.execute) {
      execute = module.execute
    } else {
      throw new Error(`missing export const execute function`)
    }
    const response = GetSuccessResponse.getSuccessResponse(firstMessage, null)
    ipc.send(response)
  } catch (error) {
    const response = await GetErrorResponse.getErrorResponse(firstMessage, error)
    ipc.send(response)
    return
  }
  HandleIpc.handleIpc(ipc)
}

main()
