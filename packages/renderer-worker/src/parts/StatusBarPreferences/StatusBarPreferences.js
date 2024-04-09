import * as Preferences from '../Preferences/Preferences.js'

export const itemsVisible = () => {
  const statusBarItemsPreference = Preferences.get('statusBar.itemsVisible') ?? false
  return statusBarItemsPreference
}
