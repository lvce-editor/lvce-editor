import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as DirentType from '../DirentType/DirentType.js'

export const getDirentType = (fileHandleKind) => {
  switch (fileHandleKind) {
    case FileHandleType.Directory:
      return DirentType.Directory
    case FileHandleType.File:
      return DirentType.File
    default:
      return DirentType.Unknown
  }
}
