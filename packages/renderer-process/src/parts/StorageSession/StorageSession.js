import * as StorageBrowser from '../StorageBrowser/StorageBrowser.js'

const storage = sessionStorage

export const getItem = (key) => {
  return StorageBrowser.getItem(storage, key)
}

export const setItem = (key, value) => {
  StorageBrowser.setItem(storage, key, value)
}

export const clear = () => {
  StorageBrowser.clear(storage)
}
