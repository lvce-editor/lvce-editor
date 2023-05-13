import * as CommandMap from '../CommandMap/CommandMap.js'
import * as CommandState from '../CommandState/CommandState.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const main = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const handleMessage = async (message, handle) => {
    const response = await GetResponse.getResponse(message, handle)
    ipc.send(response)
  }
  ipc.on('message', handleMessage)
}
