import * as Preferences from '../Preferences/Preferences.js'

export const name = 'Preferences'

export const Commands = {
  getUserPreferences: Preferences.getUserPreferences,
  getDefaultPreferences: Preferences.getDefaultPreferences,
  getOverrides: Preferences.getOverrides,
}
