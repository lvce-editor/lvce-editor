import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const create = async () => {
  const worker = await IpcParent.create({
    method: IpcParentType.ModuleWorker,
    url: new URL(
      '../../../../pdf-worker/src/pdfWorkerMain.js',
      import.meta.url
    ),
    name: 'Pdf Worker',
  })
  return worker
}
