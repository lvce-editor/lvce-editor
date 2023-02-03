import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as UploadFileSystemDirectoryHandle from '../UploadFileSystemDirectoryHandle/UploadFileSystemDirectoryHandle.js'
import * as UploadFileSystemFileHandle from '../UploadFileSystemFileHandle/UploadFileSystemFileHandle.js'

/**
 *
 * @param {FileSystemHandle} fileSystemHandle
 * @param {string} pathSeparator
 * @param {string} root
 * @param {*} uploadHandles
 * @returns
 */
export const uploadHandle = (fileSystemHandle, pathSeparator, root, uploadHandles) => {
  const { kind } = fileSystemHandle
  switch (kind) {
    case FileHandleType.File:
      return UploadFileSystemFileHandle.uploadFile(fileSystemHandle, pathSeparator, root)
    case FileHandleType.Directory:
      // @ts-ignore
      return UploadFileSystemDirectoryHandle.uploadDirectory(fileSystemHandle, pathSeparator, root, uploadHandles)
    default:
      throw new Error(`unsupported file system handle type ${kind}`)
  }
}
