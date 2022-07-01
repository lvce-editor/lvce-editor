import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Json from '../Json/Json.js'

export const clear = async () => {
  await RendererProcess.invoke(
    /* SessionStorage.clear */ 'SessionStorage.clear'
  )
}

export const getJson = async (key) => {
  const item = await RendererProcess.invoke(
    /* SessionStorage.getItem */ 'SessionStorage.getItem',
    /* key */ key
  )
  if (!item) {
    return undefined
  }
  try {
    return Json.parse(item)
  } catch {
    return undefined
  }
}

export const setJson = async (key, value) => {
  const stringifiedValue = Json.stringify(value)
  await RendererProcess.invoke(
    /* SessionStorage.setItem */ 'SessionStorage.setItem',
    /* key */ key,
    /* value */ stringifiedValue
  )
}
