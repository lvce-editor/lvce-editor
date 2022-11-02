// TODO file system providers should be lazy loaded (maybe)

import * as FileSystemExtensionHost from '../ExtensionHost/ExtensionHostFileSystem.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as FileSystemApp from './FileSystemApp.js'
import * as FileSystemData from './FileSystemData.js'
import * as FileSystemDisk from './FileSystemDisk.js'
import * as FileSystemFetch from './FileSystemFetch.js'
import * as FileSystemGitHub from './FileSystemGitHub.js'
import * as FileSystemHtml from './FileSystemHtml.js'
import * as FileSystemMemory from './FileSystemMemory.js'
import * as FileSystemWeb from './FileSystemWeb.js'
import * as EncodingType from '../EncodingType/EncodingType.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

const RE_PROTOCOL = /^([a-z]+):\/\//

export const getProtocol = (uri) => {
  const protocolMatch = uri.match(RE_PROTOCOL)
  if (protocolMatch) {
    return protocolMatch[1]
  }
  return ''
}

export const state = {
  fileSystems: Object.create(null),
}

// TODO extension host should be able to register arbitrary protocols (except app, http, https, file, )
state.fileSystems[FileSystemProtocol.ExtensionHost] = FileSystemExtensionHost
state.fileSystems[FileSystemProtocol.App] = FileSystemApp
state.fileSystems[FileSystemProtocol.GitHub] = FileSystemGitHub
state.fileSystems[FileSystemProtocol.Web] = FileSystemWeb
state.fileSystems[FileSystemProtocol.Data] = FileSystemData
state.fileSystems[FileSystemProtocol.Memfs] = FileSystemMemory
state.fileSystems[FileSystemProtocol.Html] = FileSystemHtml
state.fileSystems[FileSystemProtocol.Fetch] = FileSystemFetch

const getFileSystem = (protocol) => {
  return state.fileSystems[protocol] || FileSystemDisk
}

const PROTOCOL_POST_FIX_LENGTH = 3

const getPath = (protocol, uri) => {
  if (protocol === '') {
    return uri
  }
  return uri.slice(protocol.length + PROTOCOL_POST_FIX_LENGTH)
}

export const readFile = (uri, encoding = EncodingType.Utf8) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.readFile(path, encoding)
}

export const remove = async (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.remove(path)
}

export const rename = async (oldUri, newUri) => {
  const protocol = getProtocol(oldUri)
  const oldPath = getPath(protocol, oldUri)
  const newPath = getPath(protocol, newUri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.rename(oldPath, newPath)
}

export const mkdir = async (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.mkdir(path)
}

export const writeFile = async (uri, content, encoding = EncodingType.Utf8) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.writeFile(path, content, encoding)
}

export const readDirWithFileTypes = (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.readDirWithFileTypes(path)
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.getBlobUrl(path)
}

export const copy = (sourceUri, targetUri) => {
  // TODO what if it is not the same file system?
  const protocol = getProtocol(sourceUri)
  const fileSystem = getFileSystem(protocol)
  const sourcePath = getPath(protocol, sourceUri)
  const targetPath = getPath(protocol, targetUri)
  return fileSystem.copy(sourcePath, targetPath)
}

export const getPathSeparator = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.getPathSeparator(protocol)
}

export const getRealPath = (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.getRealPath(path)
}

export const stat = (uri) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.stat(path)
}

export const chmod = (uri, permissions) => {
  const protocol = getProtocol(uri)
  const path = getPath(protocol, uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.chmod(path, permissions)
}

export const canBeRestored = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.canBeRestored
}
