import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchEmbedsProcess = async () => {
  const embedsProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: EmbedsProcessPath.embedsProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Embeds Process',
  })
  HandleIpc.handleIpc(embedsProcess)
  return embedsProcess
}
