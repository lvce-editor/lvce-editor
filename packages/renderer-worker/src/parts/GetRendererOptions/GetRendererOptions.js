import * as Preferences from '../Preferences/Preferences.js'

const defaultCacheSize = 100

const getCacheSize = () => {
  const size = Preferences.get('virtualDom.recycling.size')
  if (Number.isSafeInteger(size) && size >= 0) {
    return size
  }
  return defaultCacheSize
}

export const getRendererOptions = () => {
  const enabled = Preferences.get('virtualDom.recycling.enabled') === true
  const size = getCacheSize()
  return {
    cache: {
      dom: enabled ? size : 0,
      text: enabled ? size : 0,
    },
  }
}
