import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleUpdateWorkerMessage from '../HandleUpdateWorkerMessage/HandleUpdateWorkerMessage.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as UpdateWorkerUrl from '../UpdateWorkerUrl/UpdateWorkerUrl.js'

export const launchUpdateWorker = async () => {
  const name = 'Update Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.updateWorkerPath', UpdateWorkerUrl.updateWorkerUrl),
  })
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleUpdateWorkerMessage.handleMessage)
  } else {
    ipc.onmessage = HandleUpdateWorkerMessage.handleMessage
  }
  return ipc
}
