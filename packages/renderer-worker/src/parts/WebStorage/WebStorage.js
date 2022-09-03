import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Json from '../Json/Json.js'

export const clear = async (storageType) => {
  await RendererProcess.invoke(
    /* StorageBrowser.clear */ 'StorageBrowser.clear',
    /* StorageType */ storageType
  )
}

export const getText = async (storageType, key) => {
  const item = await RendererProcess.invoke(
    /* StorageBrowser.getItem */ 'StorageBrowser.getItem',
    /* storageType */ storageType,
    /* key */ key
  )
  return item || ''
}

export const getJson = async (storageType, key) => {
  const item = await getText(storageType, key)
  if (!item) {
    return undefined
  }
  try {
    return Json.parse(item)
  } catch {
    return undefined
  }
}

export const setText = async (storageType, key, value) => {
  await RendererProcess.invoke(
    /* StorageBrowser.setItem */ 'StorageBrowser.setItem',
    /* storageType */ storageType,
    /* key */ key,
    /* value */ value
  )
}

export const setJson = async (storageType, key, value) => {
  const stringifiedValue = Json.stringify(value)
  await setText(storageType, key, stringifiedValue)
}
