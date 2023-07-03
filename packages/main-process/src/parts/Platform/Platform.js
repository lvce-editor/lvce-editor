const { join } = require('node:path')
const { tmpdir, homedir } = require('node:os')
const Root = require('../Root/Root.js')

const { env, platform } = process

exports.isLinux = platform === 'linux'

exports.isMacOs = platform === 'darwin'

exports.isWindows = platform === 'win32'

exports.isProduction = false

exports.isArchLinux = false

exports.isAppImage = false

const homeDirectory = homedir()

exports.applicationName = 'lvce-oss'

const xdgConfig = env.XDG_CONFIG_HOME || (homeDirectory ? join(homeDirectory, '.config') : undefined)

const xdgCache = env.XDG_CACHE_HOME || (homeDirectory ? join(homeDirectory, '.cache') : undefined)

const configDir = join(xdgConfig || tmpdir(), exports.applicationName)

const xdgData = env.XDG_DATA_HOME || (homeDirectory ? join(homeDirectory, '.local', 'share') : undefined)

const dataDir = join(xdgData || tmpdir(), exports.applicationName)

exports.getBuiltinSelfTestPath = () => {
  return process.env.BUILTIN_SELF_TEST_PATH || join(Root.root, 'extensions', 'builtin.self-test', 'bin', 'SelfTest.js')
}

exports.getWebPath = () => {
  return process.env.WEB_PATH || join(Root.root, 'packages', 'web', 'src', 'web.js')
}

exports.chromeUserDataPath = xdgCache ? join(xdgCache, exports.applicationName, 'userdata') : ''

exports.version = '0.0.0-dev'

exports.commit = 'unknown commit'

exports.scheme = 'lvce-oss'

exports.productNameLong = 'Lvce Editor - OSS'

exports.getSessionId = () => {
  return process.env.SESSION_ID || `persist:${exports.scheme}`
}

exports.getSharedProcessPath = () => {
  return join(Root.root, 'packages', 'shared-process', 'src', 'sharedProcessMain.js')
}

exports.getExtensionHostPath = () => {
  return join(Root.root, 'packages', 'extension-host', 'src', 'extensionHostMain.js')
}

exports.getDefaultSettingsPath = () => {
  return join(Root.root, 'static', 'config', 'defaultSettings.json')
}

exports.getUserSettingsPath = () => {
  return join(configDir, 'settings.json')
}

exports.getPreloadUrl = () => {
  return join(Root.root, 'packages', 'main-process', 'src', 'preload.js')
}

exports.getChromeExtensionsPath = () => {
  return join(dataDir, 'electron-browser-view-chrome-extensions')
}

exports.getExtensionHostHelperProcessPath = () => {
  return join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.js')
}

exports.getExtensionHostHelperProcessPathCjs = () => {
  return join(Root.root, 'packages', 'extension-host-helper-process', 'src', 'extensionHostHelperProcessMain.cjs')
}

exports.getVersion = () => {
  return this.version
}

exports.getCommit = () => {
  return this.commit
}

exports.getProductNameLong = () => {
  return this.productNameLong
}
