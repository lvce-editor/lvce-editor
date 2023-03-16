import * as Json from '../Json/Json.js'
import * as MapObject from '../MapObject/MapObject.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const clear = async (storageType) => {
  await RendererProcess.invoke(/* WebStorage.clear */ 'WebStorage.clear', /* StorageType */ storageType)
}

export const getText = async (storageType, key) => {
  const item = await RendererProcess.invoke(/* WebStorage.getItem */ 'WebStorage.getItem', /* storageType */ storageType, /* key */ key)
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
  await RendererProcess.invoke(/* WebStorage.setItem */ 'WebStorage.setItem', /* storageType */ storageType, /* key */ key, /* value */ value)
}

export const setJson = async (storageType, key, value) => {
  const stringifiedValue = Json.stringifyCompact(value)
  await setText(storageType, key, stringifiedValue)
}

export const setJsonObjects = async (storageType, objects) => {
  const serializedObjects = MapObject.mapObject(objects, Json.stringifyCompact)
  await RendererProcess.invoke('WebStorage.setJsonObjects', storageType, serializedObjects)
}
