import * as Assert from '../Assert/Assert.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const createWorker = async ({ method, url, name }) => {
  Assert.string(method)
  Assert.string(url)
  Assert.string(name)
  const ipc = IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name,
  })
  return ipc
}
