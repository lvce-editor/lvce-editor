import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as Command from '../Command/Command.ts'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.ts'

const removeLeadingSlash = (path) => {
  const workspacePath = '' // TODO ask renderer worker for path
  return path.slice(workspacePath.length - FileSystemProtocol.Fetch.length - 2)
}

export const searchFile = async (path, value) => {
  const fetchUri = `${AssetDir.assetDir}/config/fileMap.json`
  const fileList = await Command.execute('Ajax.getJson', fetchUri)
  const result = fileList.map(removeLeadingSlash)
  return result
}
