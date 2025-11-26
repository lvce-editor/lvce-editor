import * as Assert from '../Assert/Assert.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const hasContextMenuNativePreference = () => {
  const value = Preferences.get('window.titleBarStyle')
  return value === 'native'
}

const getModule = () => {
  if (Platform.platform === PlatformType.Electron && hasContextMenuNativePreference()) {
    return import('./ContextMenuElectron.js')
  }
  return import('./ContextMenuBrowser.js')
}

export const show = async (x, y, id, ...args) => {
  throw new Error(`ContextMenu.show is deprecated. Use ContextMenu.show2 instead`)
}

export const show2 = async (uid, menuId, x, y, ...args) => {
  Assert.number(uid)
  Assert.number(menuId)
  Assert.number(x)
  Assert.number(y)
  const module = await getModule()
  // @ts-ignore
  return module.show2(uid, menuId, x, y, ...args)
}
