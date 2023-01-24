import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FilesystemHandle from '../FileSystemHandle/FileSystemHandle.js'

export const uploadDirectory = async (fileSystemHandle, pathSeparator, root, uploadHandles) => {
  const folderPath = root + pathSeparator + fileSystemHandle.name
  await FileSystem.mkdir(folderPath)
  const childHandles = await FilesystemHandle.getChildHandles(fileSystemHandle)
  await uploadHandles(childHandles, pathSeparator, folderPath)
}
