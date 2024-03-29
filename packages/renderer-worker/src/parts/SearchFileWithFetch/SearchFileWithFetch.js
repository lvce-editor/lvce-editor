import * as AssetDir from '../AssetDir/AssetDir.js'
import * as Command from '../Command/Command.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as Workspace from '../Workspace/Workspace.js'

const removeLeadingSlash = (path) => {
  const workspacePath = Workspace.state.workspacePath
  return path.slice(workspacePath.length - FileSystemProtocol.Fetch.length - 2)
}

export const searchFile = async (path, value) => {
  const fetchUri = `${AssetDir.assetDir}/config/fileMap.json`
  const fileList = await Command.execute('Ajax.getJson', fetchUri)
  const result = fileList.map(removeLeadingSlash)
  return result
}
