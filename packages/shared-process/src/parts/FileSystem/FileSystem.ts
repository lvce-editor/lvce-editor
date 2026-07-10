// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as Assert from '../Assert/Assert.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { FileNotFoundError } from '../FileNotFoundError/FileNotFoundError.ts'
import * as GetDirentType from '../GetDirentType/GetDirentType.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as Path from '../Path/Path.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Trash from '../Trash/Trash.ts'
import { VError } from '../VError/VError.ts'

export const state: any = {
  watcherMap: Object.create(null),
}

export const copy = async (source: any, target: any): Promise<any> => {
  try {
    await fs.cp(source, target, { recursive: true })
  } catch (error) {
    if (error && error.message && error.message.startsWith('Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)')) {
      throw new VError(`Failed to copy "${source}" to "${target}": src and dest cannot be the same`)
    }
    throw new VError(error, `Failed to copy "${source}" to "${target}"`)
  }
}

// TODO extensions should only be accessed once on startup

/**
 *
 * @param {string} path
 * @param {BufferEncoding} encoding
 * @returns
 */
export const readFile = async (path: any, encoding: any = EncodingType.Utf8): Promise<any> => {
  // console.info('[shared-process] read file', path)
  try {
    Assert.string(path)
    // const start = performance.now()
    // console.time(`read ${path}`)
    const content = await fs.readFile(path, encoding)
    // const end = performance.now()
    // console.log('read', path, 'took', (end - start).toFixed(2), 'ms')
    // console.timeEnd(`read ${path}`)
    return content
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      throw new FileNotFoundError(path)
    }
    throw new VError(error, `Failed to read file "${path}"`)
  }
}

const toPath = (uri: any): any => {
  if (uri.startsWith('file://')) {
    return fileURLToPath(uri)
  }
  return uri
}

export const readJson = async (uri: any): Promise<any> => {
  try {
    Assert.string(uri)
    const path = toPath(uri)
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

export const readFileAsBuffer = async (path: any): Promise<any> => {
  try {
    Assert.string(path)
    const content = await fs.readFile(path)
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
export const writeFile = async (path: any, content: any, encoding: any = EncodingType.Utf8): Promise<any> => {
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

export const ensureFile = async (path: any, content: any): Promise<any> => {
  try {
    await fs.mkdir(Path.dirname(path), { recursive: true })
    await fs.writeFile(path, content)
  } catch (error) {
    throw new VError(error, `Failed to write to file "${path}"`)
  }
}

export const createFile = async (path: any): Promise<any> => {
  try {
    await fs.writeFile(path, '', { flag: 'wx' })
  } catch (error) {
    throw new VError(error, `Failed to create file "${path}"`)
  }
}

export const createFolder = async (path: any, options: any): Promise<any> => {
  try {
    await fs.mkdir(path, options)
  } catch (error) {
    throw new VError(error, `Failed to create folder "${path}"`)
  }
}

const isOkayToRemove = (path: any): any => {
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

export const remove = async (path: any): Promise<any> => {
  if (!isOkayToRemove(path)) {
    console.warn('not removing path')
    return
  }

  // TODO lazyload trash (doesn't work currently because of bug with jest)
  // const { trash } = await import('../../wrap/trash.ts')
  try {
    await Trash.trash(path)
  } catch (error) {
    throw new VError(error, `Failed to remove "${path}"`)
  }
}

export const forceRemove = async (path: any): Promise<any> => {
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

export const exists = async (path: any): Promise<any> => {
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
const toPrettyDirent = (dirent: any): any => {
  return {
    name: dirent.name,
    type: GetDirentType.getDirentType(dirent),
  }
}

export const readDirWithFileTypes = async (path: any): Promise<any> => {
  try {
    const dirents = await fs.readdir(path, { withFileTypes: true })
    const prettyDirents = dirents.map(toPrettyDirent)
    return prettyDirents
  } catch (error) {
    throw new VError(error, `Failed to read directory "${path}"`)
  }
}

export const readDir = async (path: any): Promise<any> => {
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

export const mkdir = async (path: any): Promise<any> => {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to create directory "${path}"`)
  }
}

const fallbackRename = async (oldPath: any, newPath: any): Promise<any> => {
  try {
    await fs.cp(oldPath, newPath, { recursive: true })
    await fs.rm(oldPath, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to rename "${oldPath}" to "${newPath}"`)
  }
}

export const rename = async (oldPath: any, newPath: any): Promise<any> => {
  try {
    await fs.rename(oldPath, newPath)
  } catch (error) {
    if (error && error.code === ErrorCodes.EXDEV) {
      return fallbackRename(oldPath, newPath)
    }
    throw new VError(error, `Failed to rename "${oldPath}" to "${newPath}"`)
  }
}

export const getPathSeparator = (): any => {
  return Platform.getPathSeparator()
}

export const getRealPath = async (path: any): Promise<any> => {
  try {
    return await fs.realpath(path)
  } catch (error) {
    // @ts-ignore
    if (
      error &&
      error instanceof globalThis.Error &&
      // @ts-ignore
      error.code === ErrorCodes.ENOENT
    ) {
      let content
      try {
        content = await fs.readlink(path)
      } catch {
        throw new VError(error, `Failed to resolve real path for ${path}`)
      }
      throw new VError(`Broken symbolic link: File not found ${content}`)
    }
    throw new VError(error, `Failed to resolve real path for ${path}`)
  }
}

// TODO handle error
export const stat = async (path: any): Promise<any> => {
  const stats = await fs.stat(path)
  const type = GetDirentType.getDirentType(stats)
  return type
}

export const chmod = async (path: any, permissions: any): Promise<any> => {
  await fs.chmod(path, permissions)
}
export const copyFile = async (from: any, to: any): Promise<any> => {
  try {
    await fs.copyFile(from, to)
  } catch (error) {
    throw new VError(error, `Failed to copy file from ${from} to ${to}`)
  }
}

export const cp = async (from: any, to: any): Promise<any> => {
  try {
    await fs.cp(from, to, { recursive: true })
  } catch (error) {
    throw new VError(error, `Failed to copy folder from ${from} to ${to}`)
  }
}

// export const unwatch = (id) => {
//   state.watchers[id].close()
//   delete state.watchers[id]
// }

// export const unwatchAll = () => {
//   for (const key in state.watchers) {
//     unwatch(key)
//   }
// }

// TODO ui should show useful error message when file cannot be saved
// and for permission denied error it should use that npm module that allows root

export const getRealUri = (pathOrUri: any): any => {
  try {
    const uri = fileURLToPath(pathOrUri).toString()
    return uri
  } catch {
    return pathOrUri
  }
}
