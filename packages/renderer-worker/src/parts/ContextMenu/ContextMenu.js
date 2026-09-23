import * as Assert from '../Assert/Assert.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

const isSimpleBrowserMenu = (menuId) => {
  return menuId === MenuEntryId.SimpleBrowserTab || menuId === MenuEntryId.SimpleBrowserToolbar
}

const hasContextMenuNativePreference = (menuId) => {
  if (isSimpleBrowserMenu(menuId)) {
    return Preferences.get('simpleBrowser.nativeContextMenu') === true
  }
  const value = Preferences.get('window.titleBarStyle')
  return value === 'native'
}

const getModule = (menuId) => {
  if (Platform.getPlatform() === PlatformType.Electron && hasContextMenuNativePreference(menuId)) {
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
  const module = await getModule(menuId)
  // @ts-ignore
  return module.show2(uid, menuId, x, y, ...args)
}

export const show2Below = async (uid, menuId, x, y, ...args) => {
  Assert.number(uid)
  Assert.number(menuId)
  Assert.number(x)
  Assert.number(y)
  const module = await getModule(menuId)
  return module.show2Below(uid, menuId, x, y, ...args)
}
