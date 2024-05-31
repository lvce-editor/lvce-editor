import * as IsFile from '../IsFile/IsFile.ts'

export const getFilePathElectron = (file: File) => {
  if (!IsFile.isFile(file)) {
    throw new TypeError(`file must be of type File`)
  }
  return globalThis.webUtils.getFilePathElectron(file)
}
