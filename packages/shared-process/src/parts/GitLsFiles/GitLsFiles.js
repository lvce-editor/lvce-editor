import { execSync } from 'child_process'
import { createHash } from 'crypto'
import * as ExecCommand from '../ExecCommand/ExecCommand.js'
import * as FileSearchResultType from '../FileSearchResultType/FileSearchResultType.js'

const gitLsFilesUncached = async (gitPath, cwd) => {
  const s = performance.now()
  const { stdout, stderr } = await ExecCommand.execCommand(gitPath, ['ls-files'], {
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

const gitLsFilesCached = async (gitPath, cwd) => {
  const s = performance.now()
  const finalHash = await ExecCommand.execCommandHash(gitPath, ['ls-files'], {
    cwd,
  })
  const e = performance.now()
  console.log(`git ls files took ${e - s}, ${finalHash} `)
  // TODO limit stdout lines to given limit
  return {
    type: FileSearchResultType.FromCache,
    cacheId: finalHash,
    stdout: '',
  }
}

export const gitLsFiles = async (gitPath, cwd, limit) => {
  const result = await gitLsFilesUncached(gitPath, cwd)
  return {
    type: FileSearchResultType.New,
    cacheId: result.cacheId,
    stdout: result.stdout,
  }
}

export const gitLsFilesHash = async (gitPath, cwd, limit) => {
  const result = await gitLsFilesCached(gitPath, cwd)
  return {
    type: FileSearchResultType.New,
    cacheId: result.cacheId,
    stdout: '',
  }
}

export const resolveGit = async () => {
  const bin = execSync(`which git`).toString().trim()
  return bin
}
