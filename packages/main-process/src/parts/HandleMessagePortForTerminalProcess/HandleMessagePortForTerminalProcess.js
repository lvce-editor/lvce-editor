const Assert = require('../Assert/Assert.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

const getTerminalProcessPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
exports.handlePort = async (event, browserWindowPort, type, name) => {
  Assert.object(event)
  Assert.object(browserWindowPort)
  Assert.string(type)
  Assert.string(name)
  const ptyHostPath = getTerminalProcessPath()
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
    [browserWindowPort]
  )
}
