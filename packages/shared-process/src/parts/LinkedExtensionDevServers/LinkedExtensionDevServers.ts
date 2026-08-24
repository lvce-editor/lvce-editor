import { spawn, type ChildProcess } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import * as Logger from '../Logger/Logger.ts'
import * as Process from '../Process/Process.ts'

interface LinkedExtension {
  readonly resolvedPath: string
}

interface PackageJson {
  readonly scripts?: Readonly<Record<string, unknown>>
}

type ReadPackageJson = (path: string) => Promise<PackageJson | undefined>
type SpawnProcess = (command: string, args: readonly string[], options: { cwd: string; stdio: 'inherit' }) => ChildProcess

const children = new Set<ChildProcess>()
let exitListenerRegistered = false

const readPackageJson: ReadPackageJson = async (path: string) => {
  try {
    const content = await readFile(`${path}/package.json`, 'utf8')
    return JSON.parse(content)
  } catch {
    return undefined
  }
}

const spawnProcess: SpawnProcess = (command, args, options) => {
  return spawn(command, args, options)
}

export const dispose = (): void => {
  for (const child of children) {
    child.kill()
  }
  children.clear()
}

const registerExitListener = (): void => {
  if (exitListenerRegistered) {
    return
  }
  exitListenerRegistered = true
  process.once('exit', dispose)
}

export const startDevServers = async (
  links: readonly LinkedExtension[],
  readPackage: ReadPackageJson = readPackageJson,
  spawnDevProcess: SpawnProcess = spawnProcess,
): Promise<void> => {
  const uniquePaths = new Set(links.map((link) => link.resolvedPath))
  for (const path of uniquePaths) {
    const packageJson = await readPackage(path)
    if (typeof packageJson?.scripts?.dev !== 'string') {
      continue
    }
    const command = Process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const child = spawnDevProcess(command, ['run', 'dev'], {
      cwd: path,
      stdio: 'inherit',
    })
    children.add(child)
    child.once('error', (error) => {
      children.delete(child)
      Logger.error(error)
    })
    child.once('exit', () => {
      children.delete(child)
    })
    registerExitListener()
  }
}
