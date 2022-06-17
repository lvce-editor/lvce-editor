import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Json from '../Json/Json.js'

export const clear = async () => {
  await RendererProcess.invoke(/* SessionStorage.clear */ 8976)
}

export const getJson = async (key) => {
  const item = await RendererProcess.invoke(
    /* SessionStorage.getItem */ 8977,
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
    /* SessionStorage.setItem */ 8978,
    /* key */ key,
    /* value */ stringifiedValue
  )
}
