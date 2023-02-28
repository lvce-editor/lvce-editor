import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import { VError } from '../VError/VError.js'

// TODO need jsonc parser for settings with comments

export const getUserPreferences = async () => {
  try {
    const userSettingsPath = Platform.getUserSettingsPath()
    let json
    try {
      json = await JsonFile.readJson(userSettingsPath)
    } catch (error) {
      if (error && error.message.includes('File not found')) {
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
export const getDefaultPreferences = async () => {
  try {
    const defaultSettingsPath = Platform.getDefaultSettingsPath()
    return await JsonFile.readJson(defaultSettingsPath)
  } catch (error) {
    throw new VError(error, 'Failed to load default preferences')
  }
}

// TODO efficiently load preferences -> first load cached preferences
//                                   -> on idle check preferences

const getOverrides = () => {
  const argvSliced = Process.argv.slice(2)
  const overrides = {}
  for (const argv of argvSliced) {
    if (argv.startsWith('--theme=')) {
      overrides['workbench.colorTheme'] = argv.slice('--theme='.length)
    }
  }
  return overrides
}
// TODO compare with timestamp/hash that preferences are fresh
export const getAll = async () => {
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

// TODO when preferences cannot be loaded, ui should show useful error message
