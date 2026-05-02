import * as Location from '../Location/Location.js'
import * as Reload from '../Reload/Reload.js'

const databaseName = 'auth-worker'
const objectStoreName = 'auth'
const callbackKey = 'oidcCallbackUrl'
const authCallbackPathRegex = /\/auth\/callback(?:\.html)?$/

const openDatabase = async () => {
  if (typeof indexedDB === 'undefined') {
    return undefined
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1)
    request.addEventListener('upgradeneeded', () => {
      const database = request.result
      if (!database.objectStoreNames.contains(objectStoreName)) {
        database.createObjectStore(objectStoreName)
      }
    })
    request.addEventListener('success', () => {
      resolve(request.result)
    })
    request.addEventListener('error', reject)
  })
}

export const isAuthCallbackUrl = (href) => {
  try {
    const url = new URL(href)
    return authCallbackPathRegex.test(url.pathname)
  } catch {
    return false
  }
}

export const getAuthCallbackRedirectPath = (href) => {
  try {
    const url = new URL(href)
    const rootPath = url.pathname.replace(authCallbackPathRegex, '')
    if (!rootPath) {
      return '/'
    }
    return rootPath.endsWith('/') ? rootPath : `${rootPath}/`
  } catch {
    return '/'
  }
}

export const persistCallbackUrl = async (callbackUrl) => {
  const database = await openDatabase()
  if (!database) {
    return
  }
  await new Promise((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, 'readwrite')
    const objectStore = transaction.objectStore(objectStoreName)
    objectStore.put(callbackUrl, callbackKey)
    transaction.addEventListener('complete', resolve)
    transaction.addEventListener('abort', reject)
    transaction.addEventListener('error', reject)
  })
  database.close()
}

export const hasStoredCallbackUrl = async () => {
  const database = await openDatabase()
  if (!database) {
    return false
  }
  const hasValue = await new Promise((resolve, reject) => {
    const transaction = database.transaction(objectStoreName, 'readonly')
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.get(callbackKey)
    request.addEventListener('success', () => {
      resolve(Boolean(request.result))
    })
    request.addEventListener('error', reject)
    transaction.addEventListener('abort', reject)
    transaction.addEventListener('error', reject)
  })
  database.close()
  return hasValue
}

export const handleAuthCallback = async (href) => {
  if (!isAuthCallbackUrl(href)) {
    return false
  }
  await persistCallbackUrl(href)
  await Location.setPathName(getAuthCallbackRedirectPath(href))
  await Reload.reload()
  return true
}
