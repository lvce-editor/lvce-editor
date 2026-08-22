import * as CacheStorage from '../CacheStorage/CacheStorage.js'
import * as Logger from '../Logger/Logger.js'
import * as WebStorage from '../WebStorage/WebStorage.js'
import * as WebStorageType from '../WebStorageType/WebStorageType.js'

const cleanupInterval = 24 * 60 * 60 * 1000
const lastCleanupKey = 'cacheStorage.lastCleanup'

export const shouldClean = (lastCleanup, now) => {
  if (!lastCleanup) {
    return true
  }
  const parsedLastCleanup = Number(lastCleanup)
  return !Number.isFinite(parsedLastCleanup) || parsedLastCleanup > now || now - parsedLastCleanup >= cleanupInterval
}

export const cleanExpiredCacheEntries = async (now = Date.now()) => {
  try {
    const lastCleanup = await WebStorage.getText(WebStorageType.LocalStorage, lastCleanupKey)
    if (!shouldClean(lastCleanup, now)) {
      return
    }
    await CacheStorage.deleteExpiredEntries(now)
    await WebStorage.setText(WebStorageType.LocalStorage, lastCleanupKey, `${now}`)
  } catch (error) {
    Logger.warn(`Failed to clean expired cache entries: ${error}`)
  }
}
