import VError from 'verror'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'

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
    throw new VError(error, 'Failed to load default preferences')
  }
}

// TODO efficiently load preferences -> first load cached preferences
//                                   -> on idle check preferences

export const getOverrides = () => {
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

// TODO when preferences cannot be loaded, ui should show useful error message
