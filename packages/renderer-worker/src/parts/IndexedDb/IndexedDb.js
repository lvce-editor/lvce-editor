const requestToPromise = (request) => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const openDatabase = (name, version, upgrade) => {
  const request = indexedDB.open(name, version)
  request.onupgradeneeded = () => upgrade(request.result)
  return requestToPromise(request)
}

let sessionDbPromise
const getSessionDb = () => {
  sessionDbPromise ||= openDatabase('session', 1, (database) => {
    if (!database.objectStoreNames.contains('session')) {
      const store = database.createObjectStore('session', { autoIncrement: true })
      store.createIndex('sessionId', 'sessionId', { unique: false })
    }
  })
  return sessionDbPromise
}

let handleDbPromise
const getHandleDb = () => {
  handleDbPromise ||= openDatabase('handle', 1, (database) => {
    if (!database.objectStoreNames.contains('file-handles-store')) {
      database.createObjectStore('file-handles-store')
    }
  })
  return handleDbPromise
}

let keyValueDbPromise
const getKeyValueDb = () => {
  keyValueDbPromise ||= openDatabase('lvce-keyvalue', 1, (database) => {
    if (!database.objectStoreNames.contains('lvce-keyvalue')) {
      database.createObjectStore('lvce-keyvalue')
    }
  })
  return keyValueDbPromise
}

export const saveValue = async (storeId, value) => {
  try {
    const database = await getSessionDb()
    await requestToPromise(database.transaction(storeId, 'readwrite').objectStore(storeId).add(value))
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'DataCloneError') {
      throw error
    }
  }
}

export const getValues = async (storeId) => {
  const database = await getSessionDb()
  return requestToPromise(database.transaction(storeId).objectStore(storeId).getAll())
}

export const getValuesByIndexName = async (storeId, indexName, only) => {
  const database = await getSessionDb()
  return requestToPromise(database.transaction(storeId).objectStore(storeId).index(indexName).getAll(only))
}

export const addHandle = async (uri, handle) => {
  const database = await getHandleDb()
  await requestToPromise(database.transaction('file-handles-store', 'readwrite').objectStore('file-handles-store').put(handle, uri))
}

export const getHandle = async (uri) => {
  const database = await getHandleDb()
  return requestToPromise(database.transaction('file-handles-store').objectStore('file-handles-store').get(uri))
}

export const set = async (key, value) => {
  const database = await getKeyValueDb()
  await requestToPromise(database.transaction('lvce-keyvalue', 'readwrite').objectStore('lvce-keyvalue').put(value, key))
}

export const get = async (key) => {
  const database = await getKeyValueDb()
  return requestToPromise(database.transaction('lvce-keyvalue').objectStore('lvce-keyvalue').get(key))
}
