import * as IpcParent from '../IpcParent/IpcParent.js'
import * as PdfWorkerUrl from '../PdfWorkerUrl/PdfWorkerUrl.js'

export const create = async ({ method }) => {
  const url = PdfWorkerUrl.getUrl()
  const worker = await IpcParent.create({
    method,
    url,
    name: 'Pdf Worker',
  })
  return worker
}
