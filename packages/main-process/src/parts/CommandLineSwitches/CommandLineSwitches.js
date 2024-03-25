import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as Locale from '../Locale/Locale.js'
import * as Platform from '../Platform/Platform.js'

export const enable = (parsedCliArgs) => {
  // command line switches
  if (parsedCliArgs.sandbox) {
    ElectronApp.enableSandbox()
  } else {
    // see https://github.com/microsoft/vscode/issues/151187#issuecomment-1221475319
    if (Platform.isLinux) {
      ElectronApp.appendCommandLineSwitch('--disable-gpu-sandbox')
    }
  }
  Locale.setLocale('en')
}
