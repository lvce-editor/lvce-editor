import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as UploadFileSystemDirectoryHandle from '../UploadFileSystemDirectoryHandle/UploadFileSystemDirectoryHandle.js'
import * as UploadFileSystemFileHandle from '../UploadFileSystemFileHandle/UploadFileSystemFileHandle.js'

export const uploadHandle = (fileSystemHandle, pathSeparator, root, uploadHandles) => {
  const { kind } = fileSystemHandle
  switch (kind) {
    case FileHandleType.File:
      return UploadFileSystemFileHandle.uploadFile(fileSystemHandle, pathSeparator, root)
    case FileHandleType.Directory:
      return UploadFileSystemDirectoryHandle.uploadDirectory(fileSystemHandle, pathSeparator, root, uploadHandles)
    default:
      throw new Error(`unsupported file system handle type ${kind}`)
  }
}
