import * as ApplyCustomWorkerPathCliOverride from '../ApplyCustomWorkerPathCliOverride/ApplyCustomWorkerPathCliOverride.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as JsoncFile from '../JsoncFile/JsoncFile.ts'
import * as LinkedWorkerPreferences from '../LinkedWorkerPreferences/LinkedWorkerPreferences.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Process from '../Process/Process.ts'
import { VError } from '../VError/VError.ts'
// TODO need jsonc parser for settings with comments

const builtinPreferences = {
  'window.titleBarless.enabled': false,
  'window.titleBarStyle': 'custom',
}

export const getUserPreferences = async (): Promise<any> => {
  try {
    const userSettingsPath = PlatformPaths.getUserSettingsPath()
    let json
    try {
      json = await JsoncFile.readJsonc(userSettingsPath)
    } catch (error) {
      if (IsEnoentError.isEnoentError(error)) {
        return {}
      }
      throw error
    }
    return json
  } catch (error) {
    throw new VError(error, 'failed to get user preferences')
  }
}

// TODO handle error
export const getDefaultPreferences = async (): Promise<any> => {
  try {
    const defaultSettingsPath = PlatformPaths.getDefaultSettingsPath()
    return await JsoncFile.readJsonc(defaultSettingsPath)
  } catch (error) {
    throw new VError(error, 'Failed to load default preferences')
  }
}

// TODO efficiently load preferences -> first load cached preferences
//                                   -> on idle check preferences

export const getOverrides = (): any => {
  const argvSliced = Process.argv.slice(2)
  const overrides: Record<string, any> = {}
  for (let index = 0; index < argvSliced.length; index++) {
    const argv = argvSliced[index]
    if (argv.startsWith('--theme=')) {
      overrides['workbench.colorTheme'] = argv.slice('--theme='.length)
    } else if (argv.startsWith('--process-explorer=')) {
      overrides['develop.processExplorerPath'] = argv.slice('--process-explorer='.length)
    } else if (argv.startsWith('--auth-process=')) {
      overrides['develop.authProcessPath'] = argv.slice('--auth-process='.length)
    } else if (argv.startsWith('--process-explorer-worker=')) {
      overrides['develop.processExplorerWorkerPath'] = argv.slice('--process-explorer-worker='.length)
    } else if (argv.startsWith('--activity-bar-worker=')) {
      overrides['develop.activityBarWorkerPath'] = argv.slice('--activity-bar-worker='.length)
    } else if (argv === '--auth-worker-path' && argvSliced[index + 1]) {
      overrides['develop.authWorkerPath'] = argvSliced[++index]
    } else if (argv.startsWith('--auth-worker-path=')) {
      overrides['develop.authWorkerPath'] = argv.slice('--auth-worker-path='.length)
    }
  }
  return overrides
}
// TODO compare with timestamp/hash that preferences are fresh
export const getAll = async (): Promise<any> => {
  try {
    // try {
    //   const cachedPreferences = JSON.parse(
    //     await readFile(CACHED_SETTINGS_PATH, 'utf-8')
    //   )
    //   return cachedPreferences
    // } catch {
    //   // ignore
    // }
    const defaultPreferences = await getDefaultPreferences()
    const userPreferences = await getUserPreferences()
    const overrides = getOverrides()
    // TODO separate backend and frontend preferences, ui only needs frontend preferences
    const preferences = {
      ...defaultPreferences,
      ...builtinPreferences,
      ...userPreferences,
      ...overrides,
    }
    // Keep the Linux-only window layout inert on other platforms.
    preferences['window.titleBarless.enabled'] = Platform.isLinux && preferences['window.titleBarless.enabled'] === true
    // try {
    //   await mkdir(dirname(CACHED_SETTINGS_PATH), { recursive: true })
    //   await writeFile(
    //     CACHED_SETTINGS_PATH,
    //     JSON.stringify(preferences, null, 2) + '\n'
    //   )
    // } catch {
    //   // ignore
    // }
    const preferencesWithoutCustomWorkerPaths = ApplyCustomWorkerPathCliOverride.applyCustomWorkerPathCliOverride(preferences)
    const linkedWorkerPreferences = await LinkedWorkerPreferences.getLinkedWorkerPreferences()
    return {
      ...preferencesWithoutCustomWorkerPaths,
      ...linkedWorkerPreferences,
    }
  } catch (error) {
    throw new VError(error, 'Failed to get all preferences')
  }
}

export const getAllSafe = async (): Promise<any> => {
  try {
    return await getAll()
  } catch (error) {
    Logger.error(`[shared-process] Failed to load preferences on startup, continuing with defaults: ${error}`)
    return builtinPreferences
  }
}

// TODO when preferences cannot be loaded, ui should show useful error message
