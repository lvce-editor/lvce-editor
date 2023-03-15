import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Json from '../Json/Json.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const state = Object.create(null)

export const openSettingsJson = async () => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://settings.json')
}

export const openKeyBindingsJson = async () => {
  await Command.execute(/* Main.openUri */ 'Main.openUri', /* uri */ 'app://keyBindings.json')
}

// TODO command for opening workspace settings

const getPreferencesJson = async () => {
  if (Platform.platform === PlatformType.Web) {
    const cachedPreferences = await Command.execute(/* LocalStorage.getJson */ 'LocalStorage.getJson', /* key */ 'settings')
    if (cachedPreferences) {
      return cachedPreferences
    }
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/defaultSettings.json`
    return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
  }
  return SharedProcess.invoke(SharedProcessCommandType.PreferencesGetAll)
}

const getPreferences = async () => {
  // TODO cache preferences, but they should not be stale
  const preferences = getPreferencesJson()
  return preferences
}

export const hydrate = async () => {
  try {
    // TODO should configuration be together with all other preferences (e.g. selecting color theme code is not needed on startup)
    // TODO probably not all preferences need to be kept in memory
    const preferences = await getPreferences()
    Object.assign(state, preferences)
  } catch (error) {
    ErrorHandling.logError(error)
  }
}

export const get = (key) => {
  return state[key]
}

export const set = async (key, value) => {
  state[key] = value
  if (Platform.platform === 'web') {
    const preferences = { ...state, [key]: value }
    await Command.execute(/* LocalStorage.setJson */ 'LocalStorage.setJson', /* key */ 'preferences', /* value */ preferences)
    return
  }
  const content = Json.stringify(state)
  await FileSystem.writeFile('app://settings.json', content)
}

export const update = async (settings) => {
  const newSettings = { ...state, ...settings }
  const content = Json.stringify(newSettings)
  await FileSystem.writeFile('app://settings.json', content)
  await GlobalEventBus.emitEvent('preferences.changed')
}
