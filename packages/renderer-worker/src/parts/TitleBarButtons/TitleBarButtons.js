import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'
import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const getTitleBarButtonsWeb = () => {
  return []
}

const getTitleBarButtonsRemote = () => {
  return []
}

const getTitleBarButtonsElectron = () => {
  if (
    Preferences.get('window.titleBarStyle') === 'custom' &&
    !Preferences.get('window.controlsOverlay.enabled')
  ) {
    return [
      { label: 'Minimize', icon: 'Minimize', id: 'Minimize' },
      { label: 'Maximize', icon: 'Maximize', id: 'ToggleMaximize' },
      { label: 'Close', icon: 'Close', id: 'Close' },
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
