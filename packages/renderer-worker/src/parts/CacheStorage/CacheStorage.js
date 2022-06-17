import * as Platform from '../Platform/Platform.js'

const CACHE_NAME = 'lvce-runtime'

const shouldIgnoreError = (error) => {
  // Firefox throws dom exception in private mode
  return (
    error &&
    error instanceof DOMException &&
    error.message === 'The operation is insecure.'
  )
}

export const state = {
  async getJson(key) {
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
      throw new Error(`Failed to get json from cache "${key}"`, {
        cause: error,
      })
    }
  },
  async setJson(key, value) {
    try {
      await setResponse(key, JSON.stringify(value), 'application/json')
    } catch (error) {
      if (shouldIgnoreError(error)) {
        return
      }
      throw new Error(`Failed to put json into cache "${key}"`, {
        cause: error,
      })
    }
  },
}
// TODO when caches is not defined -> should return undefined

const getCache = async () => {
  return await caches.open(CACHE_NAME)
}

const getResponse = async (key) => {
  if (typeof caches === 'undefined') {
    return undefined
  }
  if (Platform.getPlatform() === 'electron' && key.startsWith('/')) {
    // workaround for custom protocol not working with cache storage
    key = 'https://example.com' + key
  }
  const cache = await getCache()
  const response = await cache.match(key)
  return response
}

/**
 * @throws
 */
export const getJson = (key) => {
  return state.getJson(key)
}

/**
 * @throws
 */
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
    throw new Error(`Failed to get text from cache "${key}"`, {
      cause: error,
    })
  }
}

const setResponse = async (key, value, contentType) => {
  if (typeof caches === 'undefined') {
    return
  }
  // TODO cache the cache (maybe)
  if (
    Platform.getPlatform() === 'electron' && // workaround for custom protocol not working with cache storage
    key.startsWith('/')
  ) {
    key = 'https://example.com' + key
  }
  if (typeof value !== 'string') {
    console.warn(`invalid value ${value}`)
    return
  }
  const cache = await caches.open(CACHE_NAME)
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
    throw new Error(`Failed to put item into cache "${key}"`, { cause: error })
  }
}

export const setJson = async (key, value) => {
  return state.setJson(key, value)
}

/**
 * @throws
 */
export const clearCache = async () => {
  if (typeof caches === 'undefined') {
    return
  }
  try {
    await caches.delete(CACHE_NAME)
  } catch (error) {
    if (shouldIgnoreError(error)) {
      return
    }
    throw new Error('Failed to clear cache', {
      cause: error,
    })
  }
}
