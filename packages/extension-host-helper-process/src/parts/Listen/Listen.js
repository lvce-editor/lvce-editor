import * as CommandMap from '../CommandMap/CommandMap.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.js'

export const listen = async (argv) => {
  Object.assign(CommandMapRef.commandMapRef, CommandMap.commandMap)
  await IpcChild.listen({
    method: IpcChildType.Auto(argv),
    commandMap: CommandMapRef.commandMapRef,
  })
}
