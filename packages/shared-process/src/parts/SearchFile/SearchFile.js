import { stat } from 'fs/promises'
import { dirname, join } from 'path'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Exec from '../Exec/Exec.js'
import * as RgPath from '../RgPath/RgPath.js'

const cache = Object.create(null)

const ripGrepPath = process.env.RIP_GREP_PATH || RgPath.rgPath

const isEnoentErrorLinux = (error) => {
  return error.code === ErrorCodes.ENOENT
}

const isEnoentErrorWindows = (error) => {
  return error.message.includes('The system cannot find the path specified.')
}

const isEnoentError = (error) => {
  if (!error) {
    return false
  }
  return isEnoentErrorLinux(error) || isEnoentErrorWindows(error)
}

// TODO don't necessarily need ripgrep to list all the files,
// maybe also a faster c program can do it
// another option would be to cache the results in renderer-worker and
// do a delta comparison, so the first time it would send 100kB
// but the second time only a few hundred bytes of changes

export const searchFileDefault = async (path, searchTerm) => {
  try {
    const { stdout, stderr } = await Exec.exec(
      ripGrepPath,
      ['--files', '--sort-files'],
      {
        cwd: path,
      }
    )

    const lines = stdout.split('\n')
    return lines.slice(0, 512).join('\n')
  } catch (error) {
    // @ts-ignore
    if (isEnoentError(error)) {
      console.info(`[info] ripgrep could not be found at "${ripGrepPath}"`)
      return []
    }
    // @ts-ignore
    if (error && error.stderr === '') {
      return []
    }
    console.error(error)
    return []
  }
}

const getFolders = (files) => {
  const folders = []
  for (const file of files) {
    const dir = dirname(file)
    if (!folders.includes(dir)) {
      folders.push(dir)
    }
  }
  return folders
}

const toAbsolutePaths = (root, paths) => {
  const absolutePaths = []
  for (const path of paths) {
    absolutePaths.push(join(root, path))
  }
  return absolutePaths
}

const getMtime = async (path) => {
  const stats = await stat(path)
  return stats.mtimeMs
}

const getMtimes = (paths) => {
  return Promise.all(paths.map(getMtime))
}

const getLastModified = async (path, files) => {
  const folders = getFolders(files)
  const absolutePaths = toAbsolutePaths(path, folders)
  console.time('getMTimes')
  const mTimes = await getMtimes(absolutePaths)
  console.timeEnd('getMTimes')
  console.log('mtimes length', folders.length)
  // console.log({ folders, mTimes })
  return -1
}

export const searchFile = async (path, searchTerm) => {
  if (!(path in cache)) {
    console.time('search')
    cache[path] = await searchFileDefault(path, searchTerm)
    console.timeEnd('search')
  }
  const files = cache[path]
  // console.log({ files })
  // const modified = await getLastModified(path, files)
  // console.log({ modified })
  return files
}
