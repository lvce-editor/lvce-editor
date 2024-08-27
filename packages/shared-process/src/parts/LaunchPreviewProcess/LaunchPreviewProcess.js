import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PreviewProcessPath from '../PreviewProcessPath/PreviewProcessPath.js'

export const launchPreviewProcess = async () => {
  const method = IpcParentType.NodeForkedProcess
  const previewProcess = await IpcParent.create({
    method,
    path: PreviewProcessPath.previewProcessPath,
    argv: [],
    execArgv: ['--trace-warnings'],
    stdio: 'inherit',
    name: 'Preview Process',
  })
  HandleIpc.handleIpc(previewProcess)
  return previewProcess
}
