const Platform = require('../Platform/Platform.js')
const JsonFile = require('../JsonFile/JsonFile.js')
const FileSystemErrorCodes = require('../FileSystemErrorCodes/FileSystemErrorCodes.js')
const { VError } = require('verror')

const get = (options, key) => {
  return options[key]
}

const readSettings = async (path) => {
  try {
    return await JsonFile.readJson(path)
  } catch (error) {
    // @ts-ignore
    if (error && error.code === FileSystemErrorCodes.ENOENT) {
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

const load = async () => {
  const defaultSettingsPath = Platform.getDefaultSettingsPath()
  const userSettingsPath = Platform.getUserSettingsPath()
  const defaultSettings = await readSettings(defaultSettingsPath)
  const userSettings = await readSettings(userSettingsPath)
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
