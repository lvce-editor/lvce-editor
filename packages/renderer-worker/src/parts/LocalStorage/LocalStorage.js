import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Json from '../Json/Json.js'

export const clear = async () => {
  await RendererProcess.invoke(/* LocalStorage.clear */ 8986)
}

export const getText = async (key) => {
  const item = await RendererProcess.invoke(
    /* LocalStorage.getItem */ 'LocalStorage.getItem',
    /* key */ key
  )
  return item || ''
}

export const getJson = async (key) => {
  const item = await getText(key)
  if (!item) {
    return undefined
  }
  try {
    return Json.parse(item)
  } catch {
    return undefined
  }
}

export const setText = async (key, value) => {
  await RendererProcess.invoke(
    /* LocalStorage.setItem */ 'LocalStorage.setItem',
    /* key */ key,
    /* value */ value
  )
}

export const setJson = async (key, value) => {
  const stringifiedValue = Json.stringify(value)
  await setText(key, stringifiedValue)
}
