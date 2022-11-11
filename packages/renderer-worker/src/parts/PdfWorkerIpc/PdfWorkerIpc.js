import * as IpcParent from '../IpcParent/IpcParent.js'

export const create = async ({ method }) => {
  const url = new URL(
    '../../../../pdf-worker/src/pdfWorkerMain.js',
    import.meta.url
  ).toString()
  const worker = await IpcParent.create({
    method,
    url,
    name: 'Pdf Worker',
  })
  return worker
}
