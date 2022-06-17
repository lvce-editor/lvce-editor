import * as RgPath from '../RgPath/RgPath.js'
import * as Exec from '../Exec/Exec.js'

const ripGrepPath = process.env.RIP_GREP_PATH || RgPath.rgPath

const isEnoentErrorLinux = (error) => {
  return error.code === 'ENOENT'
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

export const searchFile = async (path, searchTerm) => {
  try {
    const { stdout, stderr } = await Exec.exec(
      ripGrepPath,
      ['--files', '--sort-files'],
      {
        cwd: path,
      }
    )
    const lines = stdout.split('\n')
    return lines
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
