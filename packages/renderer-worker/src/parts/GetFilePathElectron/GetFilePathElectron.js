import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as Id from '../Id/Id.js'

export const getFilePathElectron = async (file) => {
  const id = Id.create()
  await Transferrable.transferToRendererProcess(id, file)
  return RendererProcess.invokeAndTransfer('GetFilePathElectron.getFilePathElectron', id)
}
