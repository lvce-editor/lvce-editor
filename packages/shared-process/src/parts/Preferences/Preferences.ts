import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as JsoncFile from '../JsoncFile/JsoncFile.ts'
import * as Logger from '../Logger/Logger.ts'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.ts'
import * as Process from '../Process/Process.ts'
import { VError } from '../VError/VError.ts'
// TODO need jsonc parser for settings with comments

const builtinPreferences = {
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

const getOverrides = (): any => {
  const argvSliced = Process.argv.slice(2)
  const overrides: Record<string, any> = {}
  for (const argv of argvSliced) {
    if (argv.startsWith('--theme=')) {
      overrides['workbench.colorTheme'] = argv.slice('--theme='.length)
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
    // try {
    //   await mkdir(dirname(CACHED_SETTINGS_PATH), { recursive: true })
    //   await writeFile(
    //     CACHED_SETTINGS_PATH,
    //     JSON.stringify(preferences, null, 2) + '\n'
    //   )
    // } catch {
    //   // ignore
    // }
    return preferences
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
