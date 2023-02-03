import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'

/**
 *
 * @param {FileSystemDirectoryHandle} fileSystemHandle
 * @param {string} pathSeparator
 * @param {string} root
 * @param {*} uploadHandles
 */
export const uploadDirectory = async (fileSystemHandle, pathSeparator, root, uploadHandles) => {
  const folderPath = root + pathSeparator + fileSystemHandle.name
  await FileSystem.mkdir(folderPath)
  const childHandles = await FileSystemDirectoryHandle.getChildHandles(fileSystemHandle)
  await uploadHandles(childHandles, pathSeparator, folderPath)
}
