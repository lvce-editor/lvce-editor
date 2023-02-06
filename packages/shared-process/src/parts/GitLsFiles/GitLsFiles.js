import { createHash } from 'crypto'
import { stat } from 'fs/promises'
import { join } from 'path'
import * as ExecCommand from '../ExecCommand/ExecCommand.js'
import * as FileSearchResultType from '../FileSearchResultType/FileSearchResultType.js'

const state = {
  /**
   * @type {any}
   */
  cache: undefined,
}

const gitLsFilesUncached = async (cwd) => {
  const s = performance.now()
  const { stdout, stderr } = await ExecCommand.execCommand('git', ['ls-files'], {
    cwd,
  })
  const e = performance.now()
  console.log(`git ls files took ${e - s}`)
  // TODO limit stdout lines to given limit
  const originalHash = createHash('sha1').update(stdout).digest('hex')

  return {
    stdout,
    cacheId: originalHash,
  }
}

const statOne = async (file) => {
  const info = await stat(file)
  return info.mtime
}

const statAll = (files) => {
  return Promise.all(files.map(statOne))
}

const toAbsolutePaths = (root, files) => {
  const absolutePaths = []
  for (const file of files) {
    absolutePaths.push(join(root, file))
  }
  return absolutePaths
}

const gitLsFilesCached = async (cwd, cached) => {
  const s = performance.now()
  const originalHash = createHash('sha1').update(cached).digest('hex')
  const finalHash = await ExecCommand.execCommandHash('git', ['ls-files'], {
    cwd,
  })
  const e = performance.now()
  console.log(`git ls files took ${e - s}, ${finalHash} ${originalHash}`)
  // TODO limit stdout lines to given limit
  return {
    type: FileSearchResultType.FromCache,
    cacheId: finalHash,
    stdout: '',
  }
}

export const gitLsFiles = async (cwd, limit) => {
  if (state.cache) {
    return gitLsFilesCached(cwd, state.cache)
  }
  const result = await gitLsFilesUncached(cwd)
  state.cache = result.stdout
  return {
    type: FileSearchResultType.New,
    cacheId: result.cacheId,
    stdout: result.stdout,
  }
}
