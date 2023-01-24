import * as EncodingType from '../EncodingType/EncodingType.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as FilesystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as Path from '../Path/Path.js'

export const uploadFile = async (fileSystemHandle, pathSeparator, root) => {
  const content = await FilesystemHandle.getBinaryString(fileSystemHandle)
  const to = Path.join(pathSeparator, root, fileSystemHandle.name)
  await FileSystem.writeFile(to, content, EncodingType.Binary)
}
