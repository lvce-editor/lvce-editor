import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'

export const uploadFileSystemHandles = async (root, pathSeparator, fileSystemHandles) => {
  return FileSystemWorker.invoke('FileSystem.uploadFileSystemHandles', root, pathSeparator, fileSystemHandles)
}
