import * as Preferences from '../Preferences/Preferences.js'

const defaultUpdateInterval = 1000
const minimumUpdateInterval = 500
const maximumUpdateInterval = 5000
const updateIntervalSetting = 'processExplorer.updateInterval'

export const getUpdateInterval = () => {
  const updateInterval = Preferences.get(updateIntervalSetting)
  if (typeof updateInterval !== 'number' || !Number.isFinite(updateInterval)) {
    return defaultUpdateInterval
  }
  return Math.min(maximumUpdateInterval, Math.max(minimumUpdateInterval, updateInterval))
}
