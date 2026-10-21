import * as AssetDir from '../AssetDir/AssetDir.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ExtensionMeta from '../ExtensionMeta/ExtensionMeta.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'
import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'
import ignore from 'ignore'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.js'

const getCommandsFromExtension = (extension) => {
  if (!extension || extension.disabled || !extension.commands) {
    return []
  }
  return extension.commands.filter((command) => command.internal !== true)
}

const getCommandsFromExtensions = (extensions) => {
  return extensions.flatMap(getCommandsFromExtension)
}

export const getCommands = async (assetDir, platform, applicationId) => {
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

const getGitignore = async (uri) => {
  try {
    const contents = await FileSystemHtml.readFile(`${uri}/.gitignore`)
    return {
      hasNegation: contents.split(/\r?\n/).some((line) => /^\s*!/.test(line)),
      matcher: ignore().add(contents),
    }
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return {
        hasNegation: false,
        matcher: ignore(),
      }
    }
    throw error
  }
}

const searchDirectory = async (uri, prefix = '', gitignore) => {
  const entries = await FileSystemHtml.readDirWithFileTypes(uri)
  const results = []
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.type === DirentType.Directory) {
      if (gitignore.hasNegation || !gitignore.matcher.ignores(`${relativePath}/`)) {
        results.push(...(await searchDirectory(`${uri}/${entry.name}`, relativePath, gitignore)))
      }
    } else if (!gitignore.matcher.ignores(relativePath)) {
      results.push(relativePath)
    }
  }
  return results
}

export const searchFileWithHtml = async (uri) => {
  const gitignore = await getGitignore(uri)
  return searchDirectory(uri, '', gitignore)
}

export const searchFileWithMemory = async () => {
  return Object.entries(await FileSystemMemory.getFiles())
    .filter(([, value]) => value.type === DirentType.File)
    .map(([path]) => path)
}

export const searchFileWithProvider = (uri) => ExtensionManagementWorker.invoke('Extensions.executeWorkspaceRequest', uri, 'file-search')
