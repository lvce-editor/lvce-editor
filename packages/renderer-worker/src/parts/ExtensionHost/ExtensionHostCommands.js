import * as AssetDir from '../AssetDir/AssetDir.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'
import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'

const getCommandsFromExtension = (extension) => {
  if (!extension || extension.disabled || !extension.commands) {
    return []
  }
  return extension.commands.filter((command) => command.internal !== true)
}

const getCommandsFromExtensions = (extensions) => {
  return extensions.flatMap(getCommandsFromExtension)
}

export const getCommands = async (assetDir, platform) => {
  const extensions = await ExtensionMeta.getExtensions(assetDir, platform)
  const commands = getCommandsFromExtensions(extensions)
  return commands
}

export const executeCommand = async (id, ...args) => {
  return ExtensionManagementWorker.invoke('Extensions.executeCommand', id, ...args)
}

export const searchFileWithFetch = async (path) => {
  const response = await fetch(`${AssetDir.assetDir}/config/fileMap.json`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const fileList = await response.json()
  const prefixLength = path.length - 'file:///'.length
  return fileList.map((item) => item.replace(/^\//, '').slice(prefixLength))
}

const searchDirectory = async (uri, prefix = '') => {
  const entries = await FileSystemHtml.readDirWithFileTypes(uri)
  const results = []
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.type === DirentType.Directory) {
      results.push(...(await searchDirectory(`${uri}/${entry.name}`, relativePath)))
    } else {
      results.push(relativePath)
    }
  }
  return results
}

export const searchFileWithHtml = (uri) => searchDirectory(uri)

export const searchFileWithMemory = () => {
  return Object.entries(FileSystemMemory.getFiles())
    .filter(([, value]) => value.type === DirentType.File)
    .map(([path]) => path)
}
