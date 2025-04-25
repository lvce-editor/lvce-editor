import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import { fileURLToPath } from 'node:url'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.js'
import * as FileSystemProcess from '../FileSystemProcess/FileSystemProcess.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import { VError } from '../VError/VError.js'

const assertUri = (uri) => {
  if (!uri.startsWith('file://')) {
    throw new Error(`path must be a valid file uri`)
  }
}

export const copy = async (sourceUri, targetUri) => {
  return FileSystemProcess.invoke('FileSystem.copy', sourceUri, targetUri)
}

/**
 *
 * @param {string} uri
 * @param {BufferEncoding} encoding
 * @returns
 */
export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  return FileSystemProcess.invoke('FileSystem.readFile', uri, encoding)
}

/**
 *
 * @param {string} uri
 * @param {string} content
 * @param {BufferEncoding} encoding
 */
export const writeFile = async (uri, content, encoding = EncodingType.Utf8) => {
  return FileSystemProcess.invoke('FileSystem.writeFile', uri, content, encoding)
}

const isOkayToRemove = (path) => {
  if (path === '/') {
    return false
  }
  if (path === '~') {
    return false
  }
  if (path === os.homedir()) {
    return false
  }
  return true
}

export const remove = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.remove', uri)
}

export const forceRemove = async (uri) => {
  assertUri(uri)
  const path = fileURLToPath(uri)
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }
  try {
    await fs.rm(path, { force: true, recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to remove "${uri}"`)
  }
}

export const exists = async (uri) => {
  try {
    assertUri(uri)
    const path = fileURLToPath(uri)
    await fs.access(uri)
    return true
  } catch {
    return false
  }
}

export const readDirWithFileTypes = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.readDirWithFileTypes', uri)
}

export const readDir = async (uri) => {
  try {
    const path = fileURLToPath(uri)
    const dirents = await fs.readdir(path)
    return dirents
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read directory "${uri}"`)
  }
}

export const mkdir = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.mkdir', uri)
}

const fallbackRename = async (oldUri, newUri) => {
  try {
    const oldPath = fileURLToPath(oldUri)
    const newPath = fileURLToPath(newUri)
    await fs.cp(oldPath, newPath, { recursive: true })
    await fs.rm(oldPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to rename "${oldUri}" to "${newUri}"`)
  }
}

export const rename = async (oldUri, newUri) => {
  return FileSystemProcess.invoke('FileSystem.rename', oldUri, newUri)
}

export const getPathSeparator = () => {
  return '/'
}

// TODO handle error
export const stat = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.stat', uri)
}

export const chmod = async (uri, permissions) => {
  const path = fileURLToPath(uri)
  await fs.chmod(path, permissions)
}

export const copyFile = async (fromUri, toUri) => {
  try {
    const fromPath = fileURLToPath(fromUri)
    const toPath = fileURLToPath(toUri)
    await fs.copyFile(fromPath, toPath)
  } catch (error) {
    throw new VError(error, `Failed to copy file from ${fromUri} to ${toUri}`)
  }
}

export const cp = async (fromUri, toUri) => {
  try {
    const fromPath = fileURLToPath(fromUri)
    const toPath = fileURLToPath(toUri)
    await fs.cp(fromPath, toPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to copy folder from ${fromUri} to ${toUri}`)
  }
}

export const readJson = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.readJson', uri)
}

export const getFolderSize = async (uri) => {
  return FileSystemProcess.invoke('FileSystem.getFolderSize', uri)
}
