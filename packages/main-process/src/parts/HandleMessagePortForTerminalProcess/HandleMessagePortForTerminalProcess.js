const Root = require('../Root/Root.js')
const Path = require('../Path/Path.js')
const IpcParent = require('../IpcParent/IpcParent.js')
const IpcParentType = require('../IpcParentType/IpcParentType.js')

const getTerminalProcessPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host', 'src', 'ptyHostMain.js')
}
/**
 *
 * @param {import('electron').IpcMainEvent} event
 * @returns
 */
exports.handlePort = async (event, browserWindowPort) => {
  const ptyHostPath = getTerminalProcessPath()
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ptyHostPath,
  })
  console.log({ ipc })
}
