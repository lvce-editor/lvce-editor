import * as EncodingType from '../EncodingType/EncodingType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FilesystemFileHandle from '../FileSystemFileHandle/FileSystemFileHandle.js'
import * as Path from '../Path/Path.js'

export const uploadFile = async (fileSystemHandle, pathSeparator, root) => {
  const content = await FilesystemFileHandle.getBinaryString(fileSystemHandle)
  const to = Path.join(pathSeparator, root, fileSystemHandle.name)
  await FileSystem.writeFile(to, content, EncodingType.Binary)
}
