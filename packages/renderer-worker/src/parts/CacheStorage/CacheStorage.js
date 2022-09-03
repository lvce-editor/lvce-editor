import * as Platform from '../Platform/Platform.js'
import { VError } from '../VError/VError.js'

const shouldIgnoreError = (error) => {
  // Firefox throws dom exception in private mode
  return (
    error &&
    error instanceof DOMException &&
    error.message === 'The operation is insecure.'
  )
}

// TODO when caches is not defined -> should return undefined

const getCache = async () => {
  const cacheName = Platform.getCacheName()
  return await caches.open(cacheName)
}

const getResponse = async (key) => {
  if (typeof caches === 'undefined') {
    return undefined
  }
  if (Platform.platform === 'electron' && key.startsWith('/')) {
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
    const json = await response.json()
    return json
  } catch (error) {
    if (shouldIgnoreError(error)) {
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
    const text = await response.text()
    return text
  } catch (error) {
    if (shouldIgnoreError(error)) {
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
    Platform.platform === 'electron' && // workaround for custom protocol not working with cache storage
    key.startsWith('/')
  ) {
    key = 'https://example.com' + key
  }
  if (typeof value !== 'string') {
    console.warn(`invalid value ${value}`)
    return
  }
  const cacheName = Platform.getCacheName()
  const cache = await caches.open(cacheName)
  await cache.put(
    key,
    new Response(value, {
      headers: new Headers({
        'Content-Type': contentType,
        'Content-Length': `${value.length}`,
      }),
    })
  )
}

export const setText = async (key, value, contentType) => {
  try {
    await setResponse(key, value, contentType)
  } catch (error) {
    if (shouldIgnoreError(error)) {
      return undefined
    }
    throw new VError(error, `Failed to put item into cache "${key}"`)
  }
}

export const setJson = async (key, value) => {
  try {
    await setResponse(key, JSON.stringify(value), 'application/json')
  } catch (error) {
    if (shouldIgnoreError(error)) {
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
    const cacheName = Platform.getCacheName()
    await caches.delete(cacheName)
  } catch (error) {
    if (shouldIgnoreError(error)) {
      return
    }
    throw new VError(error, 'Failed to clear cache')
  }
}
