const StorageType = {
  LocalStorage: 1,
  SessionStorage: 2,
}

const getStorage = (storageType) => {
  switch (storageType) {
    case StorageType.LocalStorage:
      return localStorage
    case StorageType.SessionStorage:
      return sessionStorage
    default:
      throw new Error(`unsupported storage type ${storageType}`)
  }
}

export const getItem = (storageType, key) => {
  const storage = getStorage(storageType)
  return storage.getItem(key) || undefined
}

export const setItem = (storageType, key, value) => {
  const storage = getStorage(storageType)
  storage.setItem(key, value)
}

export const clear = (storageType) => {
  const storage = getStorage(storageType)
  storage.clear()
}
