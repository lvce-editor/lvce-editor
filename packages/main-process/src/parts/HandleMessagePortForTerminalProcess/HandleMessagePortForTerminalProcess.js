import * as Assert from '../Assert/Assert.js'
import * as GetTerminalProcessPath from '../GetTerminalProcessPath/GetTerminalProcessPath.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
export const handlePort = async (event, browserWindowPort, type, name) => {
  Assert.object(event)
  Assert.object(browserWindowPort)
  Assert.string(type)
  Assert.string(name)
  const ptyHostPath = GetTerminalProcessPath.getTerminalProcessPath()
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ptyHostPath,
    name,
  })
  // TODO use connectIpc for better error handling
  ipc.sendAndTransfer(
    {
      jsonrpc: '2.0',
      method: 'HandleElectronMessagePort.handleElectronMessagePort',
      params: [],
    },
    [browserWindowPort],
  )
}
