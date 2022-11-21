// TODO file system providers should be lazy loaded (maybe)

import * as FileSystemExtensionHost from '../ExtensionHost/ExtensionHostFileSystem.js'
import * as FileSystemApp from '../FileSystem/FileSystemApp.js'
import * as FileSystemData from '../FileSystem/FileSystemData.js'
import * as FileSystemDisk from '../FileSystem/FileSystemDisk.js'
import * as FileSystemFetch from '../FileSystem/FileSystemFetch.js'
import * as FileSystemGitHub from '../FileSystem/FileSystemGitHub.js'
import * as FileSystemHtml from '../FileSystem/FileSystemHtml.js'
import * as FileSystemMemory from '../FileSystem/FileSystemMemory.js'
import * as FileSystemWeb from '../FileSystem/FileSystemWeb.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

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

export const getFileSystem = (protocol) => {
  return state.fileSystems[protocol] || FileSystemDisk
}
