import * as Command from './parts/Command/Command.js'
import * as CommandState from './parts/CommandState/CommandState.js'
import * as GetErrorResponse from './parts/GetErrorResponse/GetErrorResponse.js'
import * as GetSuccessResponse from './parts/GetSuccessResponse/GetSuccessResponse.js'
import * as ImportScript from './parts/ImportScript/ImportScript.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'
import * as WaitForFirstMessage from './parts/WaitForFirstMessage/WaitForFirstMessage.js'

const main = async () => {
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
  console.log({ module })
  Rpc.listen(ipc, Command.execute)
}

main()
