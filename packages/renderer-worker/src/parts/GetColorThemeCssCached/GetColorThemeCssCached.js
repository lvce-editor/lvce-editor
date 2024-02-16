// TODO make storage configurable via settings as localstorage or indexeddb
// also allow disabling caching via settings
// then measure which option could be fastest
import * as Preferences from '../Preferences/Preferences.js'

const getCacheFn = (config) => {
  switch (config) {
    case 'localStorage':
      return import('../GetColorThemeCssCachedLocalStorage/GetColorThemeCssCachedLocalStorage.js')
    case 'indexedDb':
      return import('../GetColorThemeCssCachedIndexedDb/GetColorThemeCssCachedIndexedDb.js')
    default:
      return import('../GetColorThemeCssCachedNoop/GetColorThemeCssCachedNoop.js')
  }
}

export const getColorThemeCssCached = async (colorThemeId, getData) => {
  const config = Preferences.get('colorTheme.cache')
  const module = await getCacheFn(config)
  const cachedData = await module.get(colorThemeId)
  if (cachedData) {
    return cachedData
  }
  const newData = await getData(colorThemeId)
  await module.set(colorThemeId, newData)
  return newData
}
