import * as ExtensionHost from './ExtensionHostCore.js'
import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const readFile = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  const content = await ExtensionHost.invoke(
    /* ExtensionHost.readFile */ 'ExtensionHostFileSystem.readFile',
    /* protocol */ protocol,
    /* path */ path
  )
  Assert.string(content)
  return content
}

export const remove = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.remove */ 'ExtensionHostFileSystem.remove',
    /* protocol */ protocol,
    /* path */ path
  )
}

/**
 *
 * @param {string} protocol
 * @param {string} oldPath
 * @param {string} newPath
 */
export const rename = async (protocol, oldPath, newPath) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.rename */ 'ExtensionHostFileSystem.rename',
    /* protocol */ protocol,
    /* path */ oldPath,
    /* newPath */ newPath
  )
}

export const mkdir = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.mkdir */ -1,
    /* protocol */ protocol,
    /* path */ path
  )
}

export const createFile = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.writeFile */ 'ExtensionHostFileSystem.writeFile',
    /* protocol */ protocol,
    /* path */ path,
    /* content */ ''
  )
}

export const createFolder = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
}

export const writeFile = async (protocol, path, content) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  return ExtensionHost.invoke(
    /* ExtensionHost.writeFile */ 'ExtensionHostFileSystem.writeFile',
    /* protocol */ protocol,
    /* path */ path,
    /* content */ content
  )
}

export const readDirWithFileTypes = async (protocol, path) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  const dirents = await ExtensionHost.invoke(
    /* ExtensionHost.readDirWithFileTypes */ 'ExtensionHostFileSystem.readDirWithFileTypes',
    /* protocol */ protocol,
    /* path */ path
  )
  Assert.array(dirents)
  return dirents
}

export const getPathSeparator = async (protocol) => {
  await ExtensionHostManagement.activateByEvent(`onFileSystem:${protocol}`)
  const pathSeparator = await ExtensionHost.invoke(
    /* ExtensionHost.getPathSeparator */ 'ExtensionHostFileSystem.getPathSeparator',
    /* protocol */ protocol
  )
  Assert.string(pathSeparator)
  return pathSeparator
}
