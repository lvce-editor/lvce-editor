import * as IndexedDbKeyValueStorage from '../IndexedDbKeyValueStorage/IndexedDbKeyValueStorage.js'

const getCacheKey = (colorThemeId) => {
  return 'color-theme-' + colorThemeId
}

export const get = (colorThemeId) => {
  const cacheKey = getCacheKey(colorThemeId)
  return IndexedDbKeyValueStorage.get(cacheKey)
}

export const set = (colorThemeId, data) => {
  const cacheKey = getCacheKey(colorThemeId)
  return IndexedDbKeyValueStorage.set(cacheKey, data)
}
