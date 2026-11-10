import * as AssetDir from '../AssetDir/AssetDir.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
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

export const getCommands = async (assetDir, platform, applicationId, ifNonMatch) => {
  if (ifNonMatch !== undefined) {
    try {
      const response =
        applicationId === undefined
          ? await ExtensionManagementWorker.invoke('Extensions.getQuickPickCommands', assetDir, platform, ifNonMatch)
          : await ExtensionManagementWorker.invoke(
              'Extensions.invokeForApplication',
              applicationId,
              'Extensions.getQuickPickCommands',
              assetDir,
              platform,
              ifNonMatch,
            )
      return response
    } catch (error) {
      console.error(`Failed to get extension picks: ${error}`)
      return undefined
    }
  }
  const extensions =
    applicationId === undefined
      ? await ExtensionMeta.getExtensions(assetDir, platform)
      : await ExtensionManagementWorker.invoke('Extensions.invokeForApplication', applicationId, 'Extensions.getAllExtensions', assetDir, platform)
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

export const searchFileWithHtml = (uri) => FileSystemWorker.invoke('FileSystemHtml.fileSearch', uri)

export const searchFileWithMemory = async () => {
  return Object.entries(await FileSystemMemory.getFiles())
    .filter(([, value]) => value.type === DirentType.File)
    .map(([path]) => path)
}

export const searchFileWithProvider = (uri) => ExtensionManagementWorker.invoke('Extensions.executeWorkspaceRequest', uri, 'file-search')
