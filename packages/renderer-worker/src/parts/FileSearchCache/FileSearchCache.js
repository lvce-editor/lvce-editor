import * as CacheStorage from '../CacheStorage/CacheStorage.js'
import * as Character from '../Character/Character.js'
import { VError } from '../VError/VError.js'

const normalizeCacheKey = (cacheKey) => {
  if (cacheKey.startsWith(Character.Slash)) {
    return cacheKey
  }
  return `/${cacheKey}`
}

const cacheName = 'file-search-cache'

export const get = async (cacheKey) => {
  try {
    const normalizedCacheKey = normalizeCacheKey(cacheKey)
    const text = await CacheStorage.getTextFromCache(normalizedCacheKey)
    return text
  } catch (error) {
    throw new VError(error, `Failed to get value from file search cache`)
  }
}

export const set = async (cacheKey, value) => {
  try {
    const normalizedCacheKey = normalizeCacheKey(cacheKey)
    await CacheStorage.setText(normalizedCacheKey, value, 'text/plain')
  } catch (error) {
    throw new VError(error, `Failed to put value into file search cache`)
  }
}
