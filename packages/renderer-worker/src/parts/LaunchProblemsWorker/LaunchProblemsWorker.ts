import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ProblemsWorkerUrl from '../ProblemsWorkerUrl/ProblemsWorkerUrl.js'

export const launchProblemsWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: ProblemsWorkerUrl.problemsViewWorkerUrl,
    name: 'Problems Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
