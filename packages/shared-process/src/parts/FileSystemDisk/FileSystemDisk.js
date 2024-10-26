// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.js'
import * as GetDirentType from '../GetDirentType/GetDirentType.js'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Trash from '../Trash/Trash.js'
import { VError } from '../VError/VError.js'

export const copy = async (source, target) => {
  try {
    await fs.cp(source, target, { recursive: true })
  } catch (error) {
    if (error && error.message && error.message.startsWith('Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)')) {
      throw new VError(`Failed to copy "${source}" to "${target}": src and dest cannot be the same`)
    }
    throw new VError(error, `Failed to copy "${source}" to "${target}"`)
  }
}

/**
 *
 * @param {string} path
 * @param {BufferEncoding} encoding
 * @returns
 */
export const readFile = async (path, encoding = EncodingType.Utf8) => {
  try {
    Assert.string(path)
    const content = await fs.readFile(path, encoding)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(path)
    }
    throw new VError(error, `Failed to read file "${path}"`)
  }
}

/**
 *
 * @param {string} path
 * @param {string} content
 * @param {BufferEncoding} encoding
 */
export const writeFile = async (path, content, encoding = EncodingType.Utf8) => {
  try {
    Assert.string(path)
    Assert.string(content)
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content, encoding)
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(path)
    }
    throw new VError(error, `Failed to write to file "${path}"`)
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

export const remove = async (path) => {
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }

  // TODO lazyload trash (doesn't work currently because of bug with jest)
  // const { trash } = await import('../../wrap/trash.js')
  try {
    await Trash.trash(path)
  } catch (error) {
    throw new VError(error, `Failed to remove "${path}"`)
  }
}

export const forceRemove = async (path) => {
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }
  try {
    await fs.rm(path, { force: true, recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to remove "${path}"`)
  }
}

export const exists = async (path) => {
  try {
    await fs.access(path)
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

export const readDirWithFileTypes = async (path) => {
  try {
    const dirents = await fs.readdir(path, { withFileTypes: true })
    const prettyDirents = dirents.map(toPrettyDirent)
    return prettyDirents
  } catch (error) {
    throw new VError(error, `Failed to read directory "${path}"`)
  }
}

export const readDir = async (path) => {
  try {
    const dirents = await fs.readdir(path)
    return dirents
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(path)
    }
    throw new VError(error, `Failed to read directory "${path}"`)
  }
}

export const mkdir = async (path) => {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to create directory "${path}"`)
  }
}

const fallbackRename = async (oldPath, newPath) => {
  try {
    await fs.cp(oldPath, newPath, { recursive: true })
    await fs.rm(oldPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to rename "${oldPath}" to "${newPath}"`)
  }
}

export const rename = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath)
  } catch (error) {
    if (error && error.code === ErrorCodes.EXDEV) {
      return fallbackRename(oldPath, newPath)
    }
    throw new VError(error, `Failed to rename "${oldPath}" to "${newPath}"`)
  }
}

export const getPathSeparator = () => {
  return '/'
}

// TODO handle error
export const stat = async (path) => {
  const stats = await fs.stat(path)
  const type = GetDirentType.getDirentType(stats)
  return type
}

export const chmod = async (path, permissions) => {
  await fs.chmod(path, permissions)
}

export const copyFile = async (from, to) => {
  try {
    await fs.copyFile(from, to)
  } catch (error) {
    throw new VError(error, `Failed to copy file from ${from} to ${to}`)
  }
}

export const cp = async (from, to) => {
  try {
    await fs.cp(from, to, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to copy folder from ${from} to ${to}`)
  }
}
