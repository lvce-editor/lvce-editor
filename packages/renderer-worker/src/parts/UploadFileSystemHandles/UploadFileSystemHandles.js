import * as Command from '../Command/Command.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FilesystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as Path from '../Path/Path.js'

export const uploadFileSystemHandles = async (root, pathSeparator, fileSystemHandles) => {
  if (fileSystemHandles.length === 1) {
    const file = fileSystemHandles[0]
    const { name, kind } = file
    if (kind === FileHandleType.Directory) {
      await Command.execute('PersistentFileHandle.addHandle', `html://${name}`, file)
      await Command.execute('Workspace.setPath', `html://${name}`)
      return true
    }
  }
  for (const fileSystemHandle of fileSystemHandles) {
    const { name, kind } = fileSystemHandle
    if (kind === FileHandleType.Directory) {
      throw new Error('folder upload is not yet supported')
    }
    const content = await FilesystemHandle.getBinaryString(fileSystemHandle)
    const to = Path.join(pathSeparator, root, name)
    await FileSystem.writeFile(to, content, EncodingType.Binary)
  }
  return false
}
