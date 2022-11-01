import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  const worker = IpcParent.create({
    method: IpcParentType.ModuleWorker,
    url: new URL('../PdfWorkerCode/PdfWorkerCode.js', import.meta.url),
    name: 'Pdf Worker',
  })
  return worker
}
