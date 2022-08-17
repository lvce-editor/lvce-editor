const { join } = require('path')
const Root = require('../Root/Root.js')

exports.isLinux = () => {
  return process.platform === 'linux'
}

exports.isMacOs = () => {
  return process.platform === 'darwin'
}

exports.isWindows = () => {
  return process.platform === 'win32'
}

exports.isProduction = () => {
  return false
}

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

exports.getApplicationName = () => {
  return 'lvce-oss'
}

exports.getVersion = () => {
  return '0.0.0-dev'
}

exports.getCommit = () => {
  return 'unknown commit'
}

exports.getScheme = () => {
  return 'lvce-oss'
}

exports.getSessionId = () => {
  return process.env.SESSION_ID || `persist:${exports.getScheme()}`
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
