import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const create = async () => {
  const url = new URL(
    '../../../../pdf-worker/src/pdfWorkerMain.js',
    import.meta.url
  ).toString()
  const worker = await IpcParent.create({
    method: IpcParentType.MessagePort,
    url,
    name: 'Pdf Worker',
  })
  return worker
}
