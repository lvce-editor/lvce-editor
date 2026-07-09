import { tmpdir } from 'node:os'
import { sep } from 'node:path'
import { xdgState } from 'xdg-basedir'
import * as Process from '../Process/Process.ts'

const { env, platform } = process

export const applicationName = 'lvce-oss'

export const isWindows = platform === 'win32'

export const isMacOs = platform === 'darwin'

export const isDeb = false

export const isLinux = platform === 'linux'

export const isProduction = false

export const isArchLinux = false

export const isAppImage = false

export const scheme = 'lvce-oss'

export const getPathSeparator = (): any => {
  return sep
}

export const getStateDir = (): any => {
  return xdgState
}

export const setEnvironmentVariables = (variables: any): any => {
  for (const [key, value] of Object.entries(variables)) {
    env[key] = value as any
  }
}

export const getNodePath = (): any => {
  return Process.argv[0]
}

export const getTmpDir = (): any => {
  return tmpdir()
}

export const getRepository = (): any => {
  return `lvce-editor/lvce-editor`
}

export const getApplicationName = (): any => {
  return applicationName
}

export const getAppImageName = (): any => {
  return 'Lvce'
}

export const getSetupName = (): any => {
  return 'Lvce-Setup'
}

export const version = '0.0.0-dev'

export const commit = 'unknown commit'

export const date = ''

export const getVersion = (): any => {
  return version
}

export const getCommit = (): any => {
  return commit
}

export const getDate = (): any => {
  return date
}

export const productNameLong = 'Lvce Editor - OSS'

export const getProductNameLong = (): any => {
  return productNameLong
}

export const getArch = (): any => {
  return process.arch
}
