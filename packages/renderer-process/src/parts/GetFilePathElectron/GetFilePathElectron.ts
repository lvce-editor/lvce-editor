import * as Assert from '../Assert/Assert.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'

export const getFilePathElectron = async (id: number) => {
  Assert.number(id)
  if (!globalThis.electronGlobals) {
    throw new Error(`electron globals are not available`)
  }
  const file = Transferrable.acquire(id)
  const filePath = globalThis.electronGlobals.getPathForFile(file)
  // TODO send file back to renderer worker
  // await Transferrable.transferToRendererWorker(id, file)
  return filePath
}
