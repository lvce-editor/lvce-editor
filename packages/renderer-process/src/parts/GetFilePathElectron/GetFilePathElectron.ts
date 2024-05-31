import * as IsFile from '../IsFile/IsFile.ts'

export const getFilePathElectron = (file: File) => {
  if (!IsFile.isFile(file)) {
    throw new TypeError(`file must be of type File`)
  }
  if (!globalThis.electronGlobals) {
    throw new Error(`electron globals are not available`)
  }
  return globalThis.electronGlobals.getPathForFile(file)
}
