import * as LocalStorage from '../LocalStorage/LocalStorage.js'

const getCacheKey = (colorThemeId) => {
  return 'lvce-color-theme-' + colorThemeId
}

export const get = (colorThemeId) => {
  const cacheKey = getCacheKey(colorThemeId)
  return LocalStorage.getText(cacheKey)
}

export const set = (colorThemeId, data) => {
  const cacheKey = getCacheKey(colorThemeId)
  return LocalStorage.setText(cacheKey, data)
}
