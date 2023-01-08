import * as Assert from '../Assert/Assert.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as LimitString from '../LimitString/LimitString.js'
import * as RipGrep from '../RipGrep/RipGrep.js'
import * as Logger from '../Logger/Logger.js'

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

export const searchFile = async (path, searchTerm, limit) => {
  try {
    Assert.string(path)
    Assert.string(searchTerm)
    Assert.number(limit)
    const { stdout, stderr } = await RipGrep.exec(['--files', '--sort-files'], {
      cwd: path,
    })
    return LimitString.limitString(stdout, limit)
  } catch (error) {
    // @ts-ignore
    if (isEnoentError(error)) {
      Logger.info(
        `[shared-process] ripgrep could not be found at "${RipGrep.ripGrepPath}"`
      )
      return ``
    }
    // @ts-ignore
    if (error && error.stderr === '') {
      return ``
    }
    Logger.error(error)
    return ``
  }
}
