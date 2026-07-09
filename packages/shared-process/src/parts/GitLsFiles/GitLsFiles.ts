import * as ExecCommand from '../ExecCommand/ExecCommand.ts'
import * as Hash from '../Hash/Hash.ts'

export const gitLsFiles = async (gitPath: any, cwd: any, limit: any): Promise<any> => {
  const { stdout, stderr } = await ExecCommand.execCommand(gitPath, ['ls-files'], {
    cwd,
  })
  const hash = Hash.fromString(stdout)
  return {
    stdout,
    cacheId: hash,
  }
}

export const gitLsFilesHash = async (gitPath: any, cwd: any, limit: any): Promise<any> => {
  const hash = await ExecCommand.execCommandHash(gitPath, ['ls-files'], {
    cwd,
  })
  return hash
}

export const resolveGit = async (): Promise<any> => {
  const bin = ExecCommand.execSync(`which git`)
  return bin
}
