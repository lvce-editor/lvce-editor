import { tmpdir } from 'node:os'
import { sep } from 'node:path'
import { xdgState } from 'xdg-basedir'
import * as Process from '../Process/Process.js'

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

export const getPathSeparator = () => {
  return sep
}

export const getStateDir = () => {
  return xdgState
}

export const setEnvironmentVariables = (variables) => {
  for (const [key, value] of Object.entries(variables)) {
    env[key] = value
  }
}

export const getNodePath = () => {
  return Process.argv[0]
}

export const getTmpDir = () => {
  return tmpdir()
}

export const getRepository = () => {
  return `lvce-editor/lvce-editor`
}

export const getApplicationName = () => {
  return applicationName
}

export const getAppImageName = () => {
  return 'Lvce'
}

export const getSetupName = () => {
  return 'Lvce-Setup'
}

export const version = '0.0.0-dev'

export const commit = 'unknown commit'

export const date = ''

export const getVersion = () => {
  return version
}

export const getCommit = () => {
  return commit
}

export const getDate = () => {
  return date
}

export const productNameLong = 'Lvce Editor - OSS'

export const getProductNameLong = () => {
  return productNameLong
}

export const getArch = () => {
  return process.arch
}
