// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.js'
import * as GetDirentType from '../GetDirentType/GetDirentType.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Trash from '../Trash/Trash.js'
import * as GetFolderSizeInternal from '../GetFolderSizeInternal/GetFolderSizeInternal.js'
import { VError } from '../VError/VError.js'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const assertUri = (uri) => {
  if (!uri.startsWith('file://')) {
    throw new Error(`path must be a valid file uri`)
  }
}

export const copy = async (sourceUri, targetUri) => {
  try {
    assertUri(sourceUri)
    assertUri(targetUri)
    const source = fileURLToPath(sourceUri)
    const target = fileURLToPath(targetUri)
    await fs.cp(source, target, { recursive: true })
  } catch (error) {
    if (error && error.message && error.message.startsWith('Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)')) {
      throw new VError(`Failed to copy "${sourceUri}" to "${targetUri}": src and dest cannot be the same`)
    }
    throw new VError(error, `Failed to copy "${sourceUri}" to "${targetUri}"`)
  }
}

/**
 *
 * @param {string} uri
 * @param {BufferEncoding} encoding
 * @returns
 */
export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  try {
    Assert.string(uri)
    assertUri(uri)
    const path = fileURLToPath(uri)
    const content = await fs.readFile(path, encoding)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read file "${uri}"`)
  }
}

/**
 *
 * @param {string} uri
 * @param {string} content
 * @param {BufferEncoding} encoding
 */
export const writeFile = async (uri, content, encoding = EncodingType.Utf8) => {
  try {
    assertUri(uri)
    Assert.string(uri)
    Assert.string(content)
    const path = fileURLToPath(uri)
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content, encoding)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to write to file "${uri}"`)
  }
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
  assertUri(uri)
  const path = fileURLToPath(uri)
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }

  // TODO lazyload trash (doesn't work currently because of bug with jest)
  // const { trash } = await import('../../wrap/trash.js')
  try {
    await Trash.trash(path)
  } catch (error) {
    throw new VError(error, `Failed to remove "${uri}"`)
  }
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

/**
 * @param {import('fs').Dirent} dirent
 */
const toPrettyDirent = (dirent) => {
  return {
    name: dirent.name,
    type: GetDirentType.getDirentType(dirent),
  }
}

export const readDirWithFileTypes = async (uri) => {
  try {
    assertUri(uri)
    const path = fileURLToPath(uri)
    const dirents = await fs.readdir(path, { withFileTypes: true })
    const prettyDirents = dirents.map(toPrettyDirent)
    return prettyDirents
  } catch (error) {
    throw new VError(error, `Failed to read directory "${uri}"`)
  }
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
  try {
    assertUri(uri)
    const path = fileURLToPath(uri)
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to create directory "${uri}"`)
  }
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
  try {
    const oldPath = fileURLToPath(oldUri)
    const newPath = fileURLToPath(newUri)
    await fs.rename(oldPath, newPath)
  } catch (error) {
    if (error && error.code === ErrorCodes.EXDEV) {
      return fallbackRename(oldUri, newUri)
    }
    throw new VError(error, `Failed to rename "${oldUri}" to "${newUri}"`)
  }
}

export const getPathSeparator = () => {
  return '/'
}

// TODO handle error
export const stat = async (uri) => {
  const path = fileURLToPath(uri)
  const stats = await fs.stat(path)
  const type = GetDirentType.getDirentType(stats)
  return type
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
  try {
    Assert.string(uri)
    assertUri(uri)
    const path = fileURLToPath(uri)
    const content = await fs.readFile(path, 'utf8')
    const parsed = JSON.parse(content)
    return parsed
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(uri)
    }
    throw new VError(error, `Failed to read file as json "${uri}"`)
  }
}

export const getFolderSize = async (uri) => {
  const path = fileURLToPath(uri)
  const total = await GetFolderSizeInternal.getFolderSizeInternal(path)
  return total
}
