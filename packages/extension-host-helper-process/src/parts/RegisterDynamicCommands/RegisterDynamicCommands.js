import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as ImportScript from '../ImportScript/ImportScript.js'

export const registerDynamicCommands = async (path) => {
  Assert.string(path)
  let module
  let execute = Command.execute
  try {
    module = await ImportScript.importScript(path)
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
