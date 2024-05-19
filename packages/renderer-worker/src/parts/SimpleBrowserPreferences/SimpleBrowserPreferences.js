import * as Preferences from '../Preferences/Preferences.js'

export const getDefaultUrl = () => {
  return 'https://example.com'
}

export const getShortCuts = () => {
  const shortcuts = Preferences.get('simpleBrowser.shortcuts') || []
  return shortcuts
}
