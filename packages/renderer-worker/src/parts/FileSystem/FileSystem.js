// TODO file system providers should be lazy loaded (maybe)

import * as FileSystemApp from './FileSystemApp.js'
import * as FileSystemDisk from './FileSystemDisk.js'
import * as FileSystemGitHub from './FileSystemGitHub.js'
import * as FileSystemExtensionHost from '../ExtensionHost/ExtensionHostFileSystem.js'
import * as FileSystemWeb from './FileSystemWeb.js'
import * as FileSystemData from './FileSystemData.js'
import * as FileSystemMemory from './FileSystemMemory.js'
// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

const RE_PROTOCOL = /^([a-z]+):\/\//

const getProtocol = (uri) => {
  const protocolMatch = uri.match(RE_PROTOCOL)
  if (protocolMatch) {
    return protocolMatch[1]
  }
  return 'file'
}

export const state = {
  fileSystems: Object.create(null),
}

// TODO extension host should be able to register arbitrary protocols (except app, http, https, file, )
state.fileSystems['extension-host'] = FileSystemExtensionHost
state.fileSystems['app'] = FileSystemApp
state.fileSystems['github'] = FileSystemGitHub
state.fileSystems['web'] = FileSystemWeb
state.fileSystems['data'] = FileSystemData
state.fileSystems['memfs'] = FileSystemMemory

const getFileSystem = (protocol) => {
  return state.fileSystems[protocol] || FileSystemDisk
}

export const readFile = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.readFile(uri)
}

export const remove = async (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.remove(uri)
}

export const rename = async (oldUri, newUri) => {
  const protocol = getProtocol(oldUri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.rename(oldUri, newUri)
}

export const mkdir = async (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.mkdir(uri)
}

export const writeFile = async (uri, content) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  await fileSystem.writeFile(uri, content)
}

export const readDirWithFileTypes = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.readDirWithFileTypes(uri)
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.getBlobUrl(uri)
}

export const copy = (source, target) => {
  // TODO what if it is not the same file system?
  const protocol = getProtocol(source)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.copy(source, target)
}

export const getPathSeparator = (uri) => {
  const protocol = getProtocol(uri)
  const fileSystem = getFileSystem(protocol)
  return fileSystem.getPathSeparator(protocol)
}
