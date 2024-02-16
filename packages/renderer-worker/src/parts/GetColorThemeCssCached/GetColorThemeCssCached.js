// TODO make storage configurable via settings as localstorage or indexeddb
// also allow disabling caching via settings
// then measure which option could be fastest
import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as WebStorageType from '../WebStorageType/WebStorageType.js'

const getCacheKey = (colorThemeId) => {
  return 'lvce-color-theme-' + colorThemeId
}

const getColorThemeCssCachedLocalStorage = (colorThemeId) => {
  const cacheKey = getCacheKey(colorThemeId)
  return LocalStorage.getText(cacheKey)
}

const setColorThemeCssCachedLocalStorage = (colorThemeId, data) => {
  const cacheKey = getCacheKey(colorThemeId)
  return LocalStorage.setText(cacheKey, data)
}

export const getColorThemeCssCached = async (colorThemeId, getData) => {
  const cachedData = await getColorThemeCssCachedLocalStorage(colorThemeId)
  if (cachedData) {
    return cachedData
  }
  const newData = await getData(colorThemeId)
  await setColorThemeCssCachedLocalStorage(colorThemeId, newData)
  return newData
}
