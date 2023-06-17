const ElectronApp = require('../ElectronApp/ElectronApp.js')
const Platform = require('../Platform/Platform.js')

exports.enable = (parsedCliArgs) => {
  // command line switches
  if (parsedCliArgs.sandbox) {
    ElectronApp.enableSandbox()
  } else {
    // see https://github.com/microsoft/vscode/issues/151187#issuecomment-1221475319
    if (Platform.isLinux) {
      ElectronApp.appendCommandLineSwitch('--disable-gpu-sandbox')
    }
  }
  ElectronApp.setLocale('en')
}
