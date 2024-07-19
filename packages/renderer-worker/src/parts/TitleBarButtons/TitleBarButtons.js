import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ViewletTitleBarButtonsStrings from '../ViewletTitleBarButtons/ViewletTitleBarButtonsStrings.js'

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
      { label: ViewletTitleBarButtonsStrings.minimize(), icon: 'Minimize', id: 'Minimize' },
      { label: ViewletTitleBarButtonsStrings.maximize(), icon: 'Maximize', id: 'ToggleMaximize' },
      { label: ViewletTitleBarButtonsStrings.close(), icon: 'ChromeClose', id: 'Close' },
    ]
  }
  return []
}

// @ts-ignore
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
