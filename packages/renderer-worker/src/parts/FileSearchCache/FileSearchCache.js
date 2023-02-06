import { VError } from '../VError/VError.js'
import * as Response from '../Response/Response.js'

const normalizeCacheKey = (cacheKey) => {
  if (cacheKey.startsWith('/')) {
    return cacheKey
  }
  return `/${cacheKey}`
}

const cacheName = 'file-search-cache'

export const get = async (cacheKey) => {
  try {
    const normalizedCacheKey = normalizeCacheKey(cacheKey)
    const cache = await caches.open(cacheName)
    const response = await cache.match(normalizedCacheKey)
    if (!response) {
      return undefined
    }
    const text = await Response.getText(response)
    return text
  } catch (error) {
    throw new VError(error, `Failed to get value from file search cache`)
  }
}

export const set = async (cacheKey, value) => {
  try {
    const normalizedCacheKey = normalizeCacheKey(cacheKey)
    const cache = await caches.open(cacheName)
    await cache.put(
      normalizedCacheKey,
      Response.create(value, {
        headers: new Headers({
          'Content-Length': `${value.length}`,
        }),
      })
    )
  } catch (error) {
    throw new VError(error, `Failed to put value into file search cache`)
  }
}
