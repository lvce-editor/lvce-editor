const { join } = require('path')
const Root = require('../Root/Root.js')

exports.isLinux = process.platform === 'linux'

exports.isMacOs = process.platform === 'darwin'

exports.isWindows = process.platform === 'win32'

exports.isProduction = false

exports.getBuiltinSelfTestPath = () => {
  return (
    process.env.BUILTIN_SELF_TEST_PATH ||
    join(Root.root, 'extensions', 'builtin.self-test', 'bin', 'SelfTest.js')
  )
}

exports.getWebPath = () => {
  return (
    process.env.WEB_PATH || join(Root.root, 'packages', 'web', 'src', 'web.js')
  )
}

exports.applicationName = 'lvce-oss'

exports.version = '0.0.0-dev'

exports.commit = 'unknown commit'

exports.scheme = 'lvce-oss'

exports.ProductName = 'Lvce-OSS'

exports.getSessionId = () => {
  return process.env.SESSION_ID || `persist:${exports.scheme}`
}

exports.getSharedProcessPath = () => {
  return join(
    Root.root,
    'packages',
    'shared-process',
    'src',
    'sharedProcessMain.js'
  )
}

exports.getExtensionHostPath = () => {
  return join(
    Root.root,
    'packages',
    'extension-host',
    'src',
    'extensionHostMain.js'
  )
}
