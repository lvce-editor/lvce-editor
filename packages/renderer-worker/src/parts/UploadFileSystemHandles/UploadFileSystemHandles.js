import * as Command from '../Command/Command.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as UploadFileSystemHandle from '../UploadFileSystemHandle/UploadFileSystemHandle.js'

const uploadHandles = async (fileSystemHandles, pathSeparator, root) => {
  for (const fileSystemHandle of fileSystemHandles) {
    await UploadFileSystemHandle.uploadHandle(fileSystemHandle, pathSeparator, root, uploadHandles)
  }
}

export const uploadFileSystemHandles = async (root, pathSeparator, fileSystemHandles) => {
  if (fileSystemHandles.length === 1) {
    const file = fileSystemHandles[0]
    const { name, kind } = file
    if (kind === FileHandleType.Directory) {
      await Command.execute('PersistentFileHandle.addHandle', `/${name}`, file)
      await Command.execute('Workspace.setPath', `html:///${name}`)
      return true
    }
  }
  await uploadHandles(fileSystemHandles, pathSeparator, root)
  return false
}
