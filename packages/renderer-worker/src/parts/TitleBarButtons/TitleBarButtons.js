import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Minimize: 'Minimize',
  Maximize: 'Maximize',
  Close: 'Close',
}

const getTitleBarButtonsWeb = () => {
  return []
}

const getTitleBarButtonsRemote = () => {
  return []
}

const getTitleBarButtonsElectron = () => {
  if (Preferences.get('window.titleBarStyle') === 'custom') {
    // TODO don't render title bar buttons on windows when electron window controls overlay is enabled
    return [
      { label: UiStrings.Minimize, icon: 'Minimize', id: 'Minimize' },
      { label: UiStrings.Maximize, icon: 'Maximize', id: 'ToggleMaximize' },
      { label: UiStrings.Close, icon: 'ChromeClose', id: 'Close' },
    ]
  }
  return []
}

export const get = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return getTitleBarButtonsElectron()
    case PlatformType.Web:
      return getTitleBarButtonsWeb()
    case PlatformType.Remote:
      return getTitleBarButtonsRemote()
  }
}
