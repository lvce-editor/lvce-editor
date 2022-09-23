const Platform = require('../Platform/Platform.js')
const JsonFile = require('../JsonFile/JsonFile.js')

const get = (options, key) => {
  return options[key]
}

const readSettings = async (path) => {
  try {
    return await JsonFile.readJson(path)
  } catch (error) {
    // @ts-ignore
    if (error && error.code === 'ENOENT') {
      return {}
    }
    throw error
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

exports.get = get
exports.load = load
