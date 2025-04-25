import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcId from '../IpcId/IpcId.js'

export const listen = (method) => {
  return IpcParent.create({
    method,
    type: 'file-system-process',
    name: 'File System Process',
    ipcId: IpcId.RendererWorker,
  })
}
