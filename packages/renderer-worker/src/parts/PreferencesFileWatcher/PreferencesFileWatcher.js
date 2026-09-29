import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as GetPathDirName from '../GetPathDirName/GetPathDirName.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as PathToFileUri from '../PathToFileUri/PathToFileUri.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const ReloadDelay = 100

let reloadTimeout
let keyBindingsReloadTimeout
let keyBindingsUri = ''
let settingsUri = ''
let watcher

const scheduleReload = () => {
  if (reloadTimeout !== undefined) {
    clearTimeout(reloadTimeout)
  }
  reloadTimeout = setTimeout(async () => {
    reloadTimeout = undefined
    await Preferences.reload()
  }, ReloadDelay)
}

const scheduleKeyBindingsReload = () => {
  if (keyBindingsReloadTimeout !== undefined) {
    clearTimeout(keyBindingsReloadTimeout)
  }
  keyBindingsReloadTimeout = setTimeout(async () => {
    keyBindingsReloadTimeout = undefined
    await KeyBindings.reloadUserKeyBindings()
  }, ReloadDelay)
}

const handleEvent = (event) => {
  if (event.detail.uri === settingsUri) {
    scheduleReload()
  } else if (event.detail.uri === keyBindingsUri) {
    scheduleKeyBindingsReload()
  }
}

export const dispose = async () => {
  if (reloadTimeout !== undefined) {
    clearTimeout(reloadTimeout)
    reloadTimeout = undefined
  }
  if (keyBindingsReloadTimeout !== undefined) {
    clearTimeout(keyBindingsReloadTimeout)
    keyBindingsReloadTimeout = undefined
  }
  if (!watcher) {
    return
  }
  const oldWatcher = watcher
  watcher = undefined
  oldWatcher.removeEventListener('watcher-event', handleEvent)
  await FileWatcher.dispose(oldWatcher)
}

export const hydrate = async () => {
  await dispose()
  if (Platform.getPlatform() === PlatformType.Web) {
    return
  }
  try {
    const [settingsPath, keyBindingsPath] = await Promise.all([
      PlatformPaths.getUserSettingsPath(),
      PlatformPaths.getUserKeyBindingsPath(),
    ])
    const settingsDirectory = GetPathDirName.getPathDirName(settingsPath)
    settingsUri = PathToFileUri.pathToFileUri(settingsPath)
    keyBindingsUri = PathToFileUri.pathToFileUri(keyBindingsPath)
    watcher = await FileWatcher.watch({
      exclude: [],
      roots: [PathToFileUri.pathToFileUri(settingsDirectory)],
    })
    watcher.addEventListener('watcher-event', handleEvent)
  } catch (error) {
    console.warn(`Failed to watch user settings: ${error}`)
  }
}
