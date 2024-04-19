import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'

export const launchEmbedsProcess = async (method) => {
  const embedsProcess = await IpcParent.create({
    method,
    path: EmbedsProcessPath.embedsProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Embeds Process',
  })
  HandleIpc.handleIpc(embedsProcess)
  return embedsProcess
}
