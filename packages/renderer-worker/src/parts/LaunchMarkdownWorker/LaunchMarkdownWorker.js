import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as MarkdownWorkerUrl from '../MarkdownWorkerUrl/MarkdownWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const launchMarkdownWorker = async () => {
  const name = 'Markdown Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.markdownWorkerPath', MarkdownWorkerUrl.markdownWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
