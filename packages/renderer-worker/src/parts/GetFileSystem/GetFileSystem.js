import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

// TODO lazyload different file system providers

export const state = {
  fileSystems: Object.create(null),
}

// TODO extension host should be able to register arbitrary protocols (except app, http, https, file, )

const loadFileSystem = (procotol) => {
  switch (procotol) {
    case FileSystemProtocol.ExtensionHost:
      return import('../ExtensionHost/ExtensionHostFileSystem.js')
    case FileSystemProtocol.App:
      return import('../FileSystem/FileSystemApp.js')
    case FileSystemProtocol.GitHub:
      return import('../FileSystem/FileSystemGitHub.js')
    case FileSystemProtocol.Data:
      return import('../FileSystem/FileSystemData.js')
    case FileSystemProtocol.Memfs:
      return import('../FileSystem/FileSystemMemory.js')
    case FileSystemProtocol.Web:
      return import('../FileSystem/FileSystemWeb.js')
    case FileSystemProtocol.Fetch:
      return import('../FileSystem/FileSystemFetch.js')
    case FileSystemProtocol.Disk:
      return import('../FileSystem/FileSystemDisk.js')
    case FileSystemProtocol.Html:
      return import('../FileSystem/FileSystemHtml.js')
    default:
      throw new Error(`unknown file system protocol ${procotol}`)
  }
}

export const getFileSystem = (protocol) => {
  if (!(protocol in state.fileSystems)) {
    state.fileSystems[protocol] = loadFileSystem(protocol)
  }
  return state.fileSystems[protocol]
}
