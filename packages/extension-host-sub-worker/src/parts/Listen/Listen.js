import * as Command from '../Command/Command.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from '../GetSuccessResponse/GetSuccessResponse.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as ImportScript from '../ImportScript/ImportScript.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.js'

export const listen = async () => {
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({ method })
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(ipc)
  let module
  try {
    module = await ImportScript.importScript(firstMessage.params[0])
    if (!module || !module.commandMap) {
      throw new Error(`Missing export const commandMap`)
    }
    const commandMap = module.commandMap
    CommandState.registerCommands(commandMap)
    const response = GetSuccessResponse.getSuccessResponse(firstMessage, null)
    ipc.send(response)
  } catch (error) {
    const response = await GetErrorResponse.getErrorResponse(firstMessage, error)
    ipc.send(response)
    return
  }
  HandleIpc.handleIpc(ipc, Command.execute)
}
