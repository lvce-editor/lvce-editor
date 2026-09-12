import { execPromise } from '../ExecPromise/ExecPromise.ts'

export const getGitRemote = async (cwd: string): Promise<string> => {
  if (typeof cwd !== 'string' || !cwd) {
    throw new TypeError('Expected a workspace path')
  }
  try {
    const { stdout } = await execPromise('git', ['config', '--get', 'remote.origin.url'], { cwd, maxBuffer: 1024 * 1024, timeout: 10000 })
    return stdout.trim()
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 1) {
      return ''
    }
    throw error
  }
}
