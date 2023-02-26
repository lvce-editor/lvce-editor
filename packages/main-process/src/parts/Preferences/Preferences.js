const { VError } = require('verror')
const Platform = require('../Platform/Platform.js')
const JsonFile = require('../JsonFile/JsonFile.js')
const ErrorCodes = require('../ErrorCodes/ErrorCodes.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')

const get = (options, key) => {
  return options[key]
}

const readSettings = async (path) => {
  try {
    return await JsonFile.readJson(path)
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return {}
    }
    // @ts-ignore
    throw new VError(error, `Failed to read settings`)
  }
}

const writeSettings = async (path, value) => {
  try {
    return await JsonFile.writeJson(path, value)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to write settings`)
  }
}

const readDefaultSettings = async () => {
  try {
    const defaultSettingsPath = Platform.getDefaultSettingsPath()
    const defaultSettings = await readSettings(defaultSettingsPath)
    return defaultSettings
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to read default settings`)
  }
}

const readUserSettings = async () => {
  try {
    const userSettingsPath = Platform.getUserSettingsPath()
    const userSettings = await readSettings(userSettingsPath)
    return userSettings
  } catch (error) {
    ErrorHandling.handleError(
      // @ts-ignore
      new VError(error, `Failed to read user settings`)
    )
    return {}
  }
}

const load = async () => {
  const defaultSettings = await readDefaultSettings()
  const userSettings = await readUserSettings()
  const mergedSettings = { ...defaultSettings, ...userSettings }
  return mergedSettings
}

const update = async (key, value) => {
  const userSettingsPath = Platform.getUserSettingsPath()
  const userSettings = await readSettings(userSettingsPath)
  // TODO handle case when userSettings is of type null, number, array
  // TODO handle ENOENT error
  const newUserSettings = { ...userSettings, [key]: value }
  await writeSettings(userSettingsPath, newUserSettings)
}

exports.get = get
exports.load = load
exports.update = update
