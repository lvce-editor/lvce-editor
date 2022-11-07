import * as Assert from '../Assert/Assert.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const hasContextMenuNativePreference = () => {
  const value = Preferences.get('window.titleBarStyle')
  return value === 'native'
}

const getModule = () => {
  if (
    Platform.platform === PlatformType.Electron &&
    hasContextMenuNativePreference()
  ) {
    return import('./ContextMenuElectron.js')
  }
  return import('./ContextMenuBrowser.js')
}

export const show = async (x, y, id) => {
  Assert.number(x)
  Assert.number(y)
  Assert.number(id)
  const module = await getModule()
  return module.show(x, y, id)
}
