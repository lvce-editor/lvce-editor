// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import VError from 'verror'
import * as DirentType from '../DirentType/DirentType.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Trash from '../Trash/Trash.js'
import * as FileSystemErrorCodes from '../FileSystemErrorCodes/FileSystemErrorCodes.js'
import { FileNotFoundError } from '../Error/FileNotFoundError.js'

export const state = {
  watcherMap: Object.create(null),
}

export const copy = async (source, target) => {
  try {
    await fs.cp(source, target, { recursive: true })
  } catch (error) {
    if (
      error &&
      error.message &&
      error.message.startsWith(
        'Invalid src or dest: cp returned EINVAL (src and dest cannot be the same)'
      )
    ) {
      throw new VError(
        `Failed to copy "${source}" to "${target}": src and dest cannot be the same`
      )
    }
    throw new VError(error, `Failed to copy "${source}" to "${target}"`)
  }
}

// TODO extensions should only be accessed once on startup
export const readFile = async (path) => {
  // console.info('[shared-process] read file', path)
  try {
    // const start = performance.now()
    // console.time(`read ${path}`)
    const content = await fs.readFile(path, 'utf8')
    // const end = performance.now()
    // console.log('read', path, 'took', (end - start).toFixed(2), 'ms')
    // console.timeEnd(`read ${path}`)
    return content
  } catch (error) {
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
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
export const writeFile = async (path, content, encoding = 'utf8') => {
  try {
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content, encoding)
  } catch (error) {
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
      throw new FileNotFoundError(path)
    }
    throw new VError(error, `Failed to write to file "${path}"`)
  }
}

export const ensureFile = async (path, content) => {
  try {
    await fs.mkdir(Path.dirname(path), { recursive: true })
    await fs.writeFile(path, content)
  } catch (error) {
    throw new VError(error, `Failed to write to file "${path}"`)
  }
}

export const createFile = async (path) => {
  try {
    await fs.writeFile(path, '', { flag: 'wx' })
  } catch (error) {
    throw new VError(error, `Failed to create file "${path}"`)
  }
}

export const createFolder = async (path, options) => {
  try {
    await fs.mkdir(path, options)
  } catch (error) {
    throw new VError(error, `Failed to create folder "${path}"`)
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

export const exists = async (path) => {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

/**
 * @param {import('fs').Dirent|import('fs').StatsBase} dirent
 */
const getType = (dirent) => {
  if (dirent.isFile()) {
    return DirentType.File
  }
  if (dirent.isDirectory()) {
    return DirentType.Direcory
  }
  if (dirent.isSymbolicLink()) {
    return DirentType.Symlink
  }
  if (dirent.isSocket()) {
    return DirentType.Socket
  }
  if (dirent.isBlockDevice()) {
    return DirentType.BlockDevice
  }
  if (dirent.isCharacterDevice()) {
    return DirentType.CharacterDevice
  }
  return DirentType.Unknown
}

/**
 * @param {import('fs').Dirent} dirent
 */
const toPrettyDirent = (dirent) => {
  return {
    name: dirent.name,
    type: getType(dirent),
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
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
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
    if (error && error.code === FileSystemErrorCodes.EXDEV) {
      return fallbackRename(oldPath, newPath)
    }
    throw new VError(error, `Failed to rename "${oldPath}" to "${newPath}"`)
  }
}

export const watch = async (path, options) => {
  // let state = 'loading'
  const chokidar = await import('chokidar')
  const watcher = chokidar.watch(`${path}`, {
    ignoreInitial: true,
  })

  if (options.onAll) {
    watcher.on('all', options.onAll)
  }
  return watcher

  // const { default: chokidar } = await import('chokidar')
}

export const getPathSeparator = () => {
  return Platform.getPathSeparator()
}

export const getRealPath = async (path) => {
  try {
    return await fs.realpath(path)
  } catch (error) {
    // @ts-ignore
    if (
      error &&
      error instanceof globalThis.Error &&
      // @ts-ignore
      error.code === FileSystemErrorCodes.ENOENT
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
export const stat = async (path) => {
  const stats = await fs.stat(path)
  const type = getType(stats)
  return type
}

export const chmod = async (path, permissions) => {
  await fs.chmod(path, permissions)
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
