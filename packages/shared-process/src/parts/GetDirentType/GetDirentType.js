import * as DirentType from '../DirentType/DirentType.js'

/**
 * @param {import('fs').Dirent|import('fs').StatsBase} dirent
 */
export const getDirentType = (dirent) => {
  if (dirent.isFile()) {
    return DirentType.File
  }
  if (dirent.isDirectory()) {
    return DirentType.Directory
  }
  if (dirent.isSymbolicLink()) {
    return DirentType.Symlink
  }
  if (dirent.isSocket()) {
    return DirentType.Socket
  }
  if (dirent.isBlockDevice()) {
    return DirentType.BlockDevice
  }
  if (dirent.isCharacterDevice()) {
    return DirentType.CharacterDevice
  }
  console.log({ dirent })
  return DirentType.Unknown
}
