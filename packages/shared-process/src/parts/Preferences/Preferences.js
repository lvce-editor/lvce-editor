import VError from 'verror'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Platform from '../Platform/Platform.js'

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
    // @ts-ignore
    throw new VError(error, 'failed to get user preferences')
  }
}

// TODO handle error
export const getDefaultPreferences = async () => {
  try {
    const defaultSettingsPath = Platform.getDefaultSettingsPath()
    return await JsonFile.readJson(defaultSettingsPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to load default preferences')
  }
}

// TODO efficiently load preferences -> first load cached preferences
//                                   -> on idle check preferences

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
    // TODO separate backend and frontend preferences, ui only needs frontend preferences
    const preferences = { ...defaultPreferences, ...userPreferences }
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
