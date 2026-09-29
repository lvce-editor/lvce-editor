import { execFile } from 'node:child_process'
import { constants } from 'node:fs'
import { access, lstat, mkdir, readlink, symlink } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as Platform from '../Platform/Platform.ts'
import * as Root from '../Root/Root.ts'

const execFileAsync = promisify(execFile)

export const getMenuEntries = (): readonly any[] => {
  if (!Platform.isMacOs || !IsElectron.isElectron) {
    return []
  }
  return [{ id: 'ShellCommand.install', label: `Shell Command: Install '${Platform.applicationName}' command in PATH` }]
}

const shellQuote = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`

export const getInstallScript = (source: string, destination: string): string => {
  return `/bin/mkdir -p ${shellQuote(dirname(destination))} && /bin/ln -s ${shellQuote(source)} ${shellQuote(destination)}`
}

const elevate = async (script: string): Promise<void> => {
  await execFileAsync('/usr/bin/osascript', ['-e', 'on run argv\n do shell script (item 1 of argv) with administrator privileges\nend run', script])
}

export const installLink = async (source: string, destination: string, runElevated = elevate): Promise<string> => {
  // Check the packaged launcher before creating directories or prompting for privileges.
  await access(source, constants.X_OK)
  const existing = await lstat(destination).catch((error) => {
    if (error.code === 'ENOENT') {
      return undefined
    }
    throw error
  })
  if (existing) {
    if (existing.isSymbolicLink() && resolve(dirname(destination), await readlink(destination)) === source) {
      return destination
    }
    throw new Error(`Cannot install shell command: ${destination} already exists. Move or remove it first.`)
  }
  try {
    await mkdir(dirname(destination), { recursive: true })
    await symlink(source, destination)
  } catch (error) {
    if (error.code !== 'EACCES' && error.code !== 'EPERM') {
      throw error
    }
    // ln deliberately has no force flag, including after the privilege prompt.
    await runElevated(getInstallScript(source, destination))
  }
  return destination
}

export const install = async (): Promise<string> => {
  if (!Platform.isMacOs || !IsElectron.isElectron) {
    throw new Error('Installing the shell command is only supported in the macOS desktop app.')
  }
  const source = join(Root.root, 'bin', Platform.applicationName)
  if (source.startsWith('/Volumes/') || source.includes('/AppTranslocation/')) {
    throw new Error('Move the application to Applications and reopen it before installing the shell command.')
  }
  return installLink(source, join('/usr/local/bin', Platform.applicationName))
}
