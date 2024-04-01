import * as GetStorage from '../GetStorage/GetStorage.ts'

export const getAll = (storageType) => {
  const storage = GetStorage.getStorage(storageType)
  return { ...storage }
}

export const getItem = (storageType, key) => {
  const storage = GetStorage.getStorage(storageType)
  return storage.getItem(key) || undefined
}

export const setItem = (storageType, key, value) => {
  const storage = GetStorage.getStorage(storageType)
  storage.setItem(key, value)
}

export const setJsonObjects = (storageType, objects) => {
  const storage = GetStorage.getStorage(storageType)
  for (const [key, value] of Object.entries(objects)) {
    // @ts-ignore
    storage.setItem(key, value)
  }
}

export const clear = (storageType) => {
  const storage = GetStorage.getStorage(storageType)
  storage.clear()
}
