// TODO lazyload chokidar and trash (but doesn't work currently because of bug with jest)
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import chokidar from 'chokidar'
import * as Error from '../Error/Error.js'
import * as Path from '../Path/Path.js'
import * as Trash from '../Trash/Trash.js'
import * as Platform from '../Platform/Platform.js'
import VError from 'verror'

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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to copy "${source}" to "${target}"`,
      category: 'File System Error',
    })
  }
}

export const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, 'utf8')
    return content
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to read file "${path}"`,
      category: 'File System Error',
    })
  }
}

export const writeFile = async (path, content) => {
  try {
    // queue would be more correct for concurrent writes but also slower
    // Queue.add(`writeFile/${path}`, () =>
    await fs.writeFile(path, content)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to write to file "${path}"`,
      category: 'File System Error',
    })
  }
}

export const ensureFile = async (path, content) => {
  try {
    await fs.mkdir(Path.dirname(path), { recursive: true })
    await fs.writeFile(path, content)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to write to file "${path}"`,
      category: 'File System Error',
    })
  }
}

export const createFile = async (path) => {
  try {
    await fs.writeFile(path, '', { flag: 'wx' })
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to create file "${path}"`,
      category: 'File System Error',
    })
  }
}

export const createFolder = async (path, options) => {
  try {
    await fs.mkdir(path, options)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_SYSTEM_ERROR',
      message: `Failed to create folder "${path}"`,
      category: 'File System Error',
    })
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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_REMOVE_SYSTEM_ERROR',
      message: `Failed to remove "${path}"`,
      category: 'File System Error',
    })
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

const getType = (dirent) => {
  if (dirent.isFile()) {
    return 'file'
  }
  if (dirent.isDirectory()) {
    return 'directory'
  }
  return 'unknown'
}

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
    throw new Error.OperationalError({
      cause: error,
      code: 'E_FILE_READ_DIR_SYSTEM_ERROR',
      message: `Failed to read directory "${path}"`,
      category: 'File System Error',
    })
  }
}

export const mkdir = async (path) => {
  try {
    await fs.mkdir(path)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_CREATE_DIRECTORY_FAILED',
      message: `Failed to create directory "${path}"`,
      category: 'File System Error',
    })
  }
}

export const rename = async (oldPath, newPath) => {
  try {
    await fs.rename(oldPath, newPath)
  } catch (error) {
    throw new Error.OperationalError({
      cause: error,
      code: 'E_RENAME_FAILED',
      message: `Failed to rename "${oldPath}" to "${newPath}"`,
      category: 'File System Error',
    })
  }
}

export const watch = (path, options) => {
  // let state = 'loading'

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
