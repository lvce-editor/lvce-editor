import { VError } from '@lvce-editor/verror'
import * as Exec from '../Exec/Exec.js'
import * as Logger from '../Logger/Logger.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

const getXzOptions = () => {
  if (process.env.HIGHEST_COMPRESSION) {
    Logger.info('[info] using highest compression, this may take some time')
    return `-9e T0` // use highest compression and multiple processors
  }
  return '-1 -T0' // use low compression and multiple processors
}

/**
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarXz = async (inDir, outFile, options) => {
  const xzOptions = getXzOptions()
  await Exec.exec('tar', ['cfJ', outFile, inDir], {
    ...options,
    env: {
      ...options.env,
      XZ_OPT: xzOptions,
    },
  })
}

/**
 *
 * @param {string[]} inDirs
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarXzFolders = async (inDirs, outFile, options) => {
  try {
    const xzOptions = getXzOptions()
    await Exec.exec('tar', ['cfJ', outFile, ...inDirs], {
      ...options,
      env: {
        ...options.env,
        XZ_OPT: xzOptions,
      },
    })
  } catch (error) {
    throw new VError(error, `Failed to compress folders`)
  }
}

/**
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarZstd = async (inDir, outFile, options) => {
  await Exec.exec('tar', ['--zstd', '-cf', outFile, inDir], {
    ...options,
  })
}

/**
 *
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tar = async (inDir, outFile, options) => {
  await Exec.exec('tar', ['cf', outFile, inDir], options)
}
/**
 *
 * @param {string} inFile
 * @param {import('execa').Options} options
 */
export const xz = async (inFile, options) => {
  // https://stackoverflow.com/questions/22244962/multiprocessor-support-for-xz
  await Exec.exec('xz', ['-1', '-T0', inFile], options)
}

/**
 *
 * @param {string} inDir
 * @param {string} outFile
 * @param {import('execa').Options} options
 */
export const tarAdd = async (inDir, outFile, options) => {
  await Exec.exec('tar', ['rf', outFile, inDir], options)
}

/**
 *
 * @param {string} controlArchive
 * @param {string} dataArchive
 * @param {import('execa').Options} options
 */
export const deb = async (controlArchive, dataArchive, options) => {
  await Exec.exec('ar', ['r', 'app.deb', 'debian-binary', controlArchive, dataArchive], options)
}

/**
 * @param {string} cwd
 */
export const createMTree = async (cwd, dirents) => {
  try {
    await Exec.exec(
      `bsdtar`,
      ['-czf', '.MTREE', '--format', 'mtree', '--options', '!all,use-set,type,uid,gid,mode,time,size,md5,sha256,link', ...dirents],
      {
        env: {
          ...process.env,
          LANG: 'C',
        },
        cwd,
      },
    )
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT && error.syscall === 'spawn bsdtar') {
      throw new VError(`Failed to create mtree: Command bsdtar not found`)
    }
    throw new VError(error, `Failed to create mtree`)
  }
}
