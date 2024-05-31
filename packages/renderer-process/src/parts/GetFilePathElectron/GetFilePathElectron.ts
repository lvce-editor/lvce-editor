import * as IsFile from '../IsFile/IsFile.ts'

export const getFilePathElectron = async (file: File) => {
  if (!IsFile.isFile(file)) {
    throw new TypeError(`file must be of type File`)
  }
  if (!globalThis.electronGlobals) {
    throw new Error(`electron globals are not available`)
  }
  const filePath = globalThis.electronGlobals.getPathForFile(file)
  return filePath
}
