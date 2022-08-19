import * as Preferences from '../Preferences/Preferences.js'

export const update = async (settings) => {
  await Preferences.update(settings)
}
