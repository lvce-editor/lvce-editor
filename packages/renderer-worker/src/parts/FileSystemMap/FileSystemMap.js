import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'

export const map = {
  [FileSystemProtocol.ExtensionHost]: () => import('../ExtensionHost/ExtensionHostFileSystem.js'),
  [FileSystemProtocol.App]: () => import('../FileSystem/FileSystemApp.js'),
  [FileSystemProtocol.Data]: () => import('../FileSystem/FileSystemData.js'),
  [FileSystemProtocol.Memfs]: () => import('../FileSystem/FileSystemMemory.js'),
  [FileSystemProtocol.Web]: () => import('../FileSystem/FileSystemWeb.js'),
  [FileSystemProtocol.Fetch]: () => import('../FileSystem/FileSystemFetch.js'),
  [FileSystemProtocol.Disk]: () => import('../FileSystem/FileSystemDisk.js'),
  [FileSystemProtocol.Html]: () => import('../FileSystem/FileSystemHtml.js'),
  [FileSystemProtocol.Debug]: () => import('../FileSystem/FileSystemDebug.js'),
}
