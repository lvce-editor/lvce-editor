import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import * as Root from '../Root/Root.js'

const { env, platform } = process

export const isLinux = platform === 'linux'

export const isProduction = false

const homeDirectory = homedir()

export const applicationName = 'lvce-oss'

const xdgCache = env.XDG_CACHE_HOME || (homeDirectory ? join(homeDirectory, '.cache') : undefined)

const xdgData = env.XDG_DATA_HOME || (homeDirectory ? join(homeDirectory, '.local', 'share') : undefined)

const dataDir = join(xdgData || tmpdir(), applicationName)

export const getBuiltinSelfTestPath = () => {
  return process.env.BUILTIN_SELF_TEST_PATH || join(Root.root, 'extensions', 'builtin.self-test', 'bin', 'SelfTest.js')
}

export const getWebPath = () => {
  return process.env.WEB_PATH || join(Root.root, 'packages', 'web', 'src', 'web.js')
}

export const chromeUserDataPath = xdgCache ? join(xdgCache, applicationName, 'userdata') : ''

export const version = '0.0.0-dev'

export const commit = 'unknown commit'

export const scheme = 'lvce-oss'

export const getSessionId = () => {
  return process.env.SESSION_ID || `persist:${scheme}`
}

export const getSharedProcessPath = () => {
  if (isProduction) {
    return join(Root.root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')
  }
  return join(Root.root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')
}

export const getChromeExtensionsPath = () => {
  return join(dataDir, 'electron-browser-view-chrome-extensions')
}
