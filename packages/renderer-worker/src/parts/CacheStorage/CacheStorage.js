import * as Character from '../Character/Character.js'
import * as Logger from '../Logger/Logger.js'
import * as MimeType from '../MimeType/MimeType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformPaths from '../PlatformPaths/PlatformPaths.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Response from '../Response/Response.js'
import * as ShouldIgnoreCacheStorageError from '../ShouldIgnoreCacheStorageError/ShouldIgnoreCacheStorageError.js'
import { VError } from '../VError/VError.js'

// TODO when caches is not defined -> should return undefined

const getCache = async () => {
  const cacheName = PlatformPaths.getCacheName()
  return await caches.open(cacheName)
}

const getResponse = async (key) => {
  if (typeof caches === 'undefined') {
    return undefined
  }
  if (Platform.getPlatform() === PlatformType.Electron && key.startsWith(Character.Slash)) {
    // workaround for custom protocol not working with cache storage
    key = 'https://example.com' + key
  }
  const cache = await getCache()
  const response = await cache.match(key)
  return response
}

export const getJson = async (key) => {
  try {
    const response = await getResponse(key)
    if (!response) {
      return undefined
    }
    const json = await Response.getJson(response)
    return json
  } catch (error) {
    if (ShouldIgnoreCacheStorageError.shouldIgnoreCacheStorageError(error)) {
      return undefined
    }
    throw new VError(error, `Failed to get json from cache "${key}"`)
  }
}

export const getTextFromCache = async (key) => {
  try {
    const response = await getResponse(key)
    if (!response) {
      return undefined
    }
    const text = await Response.getText(response)
    return text
  } catch (error) {
    if (ShouldIgnoreCacheStorageError.shouldIgnoreCacheStorageError(error)) {
      return undefined
    }
    throw new VError(error, `Failed to get text from cache "${key}"`)
  }
}

const setResponse = async (key, value, contentType) => {
  if (typeof caches === 'undefined') {
    return
  }
  // TODO cache the cache (maybe)
  if (
    Platform.getPlatform() === PlatformType.Remote && // workaround for custom protocol not working with cache storage
    key.startsWith(Character.Slash)
  ) {
    key = 'https://example.com' + key
  }
  if (typeof value !== 'string') {
    Logger.warn(`invalid value ${value}`)
    return
  }
  const cacheName = PlatformPaths.getCacheName()
  const cache = await caches.open(cacheName)
  await cache.put(
    key,
    Response.create(value, {
      headers: new Headers({
        'Content-Type': contentType,
        'Content-Length': `${value.length}`,
      }),
    }),
  )
}

export const setText = async (key, value, contentType) => {
  try {
    await setResponse(key, value, contentType)
  } catch (error) {
    if (ShouldIgnoreCacheStorageError.shouldIgnoreCacheStorageError(error)) {
      return undefined
    }
    throw new VError(error, `Failed to put item into cache "${key}"`)
  }
}

export const setJson = async (key, value) => {
  try {
    await setResponse(key, JSON.stringify(value), MimeType.ApplicationJson)
  } catch (error) {
    if (ShouldIgnoreCacheStorageError.shouldIgnoreCacheStorageError(error)) {
      return
    }
    throw new VError(error, `Failed to put json into cache "${key}"`)
  }
}

export const clearCache = async () => {
  if (typeof caches === 'undefined') {
    return
  }
  try {
    const cacheName = PlatformPaths.getCacheName()
    await caches.delete(cacheName)
  } catch (error) {
    if (ShouldIgnoreCacheStorageError.shouldIgnoreCacheStorageError(error)) {
      return
    }
    throw new VError(error, 'Failed to clear cache')
  }
}
