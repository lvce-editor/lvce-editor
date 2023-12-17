import * as Assert from '../Assert/Assert.js'
import * as FontState from '../FontState/FontState.js'
import { VError } from '../VError/VError.js'

const getFonts = () => {
  // @ts-ignore
  return globalThis.fonts || document.fonts
}

export const load = async (fontName, fontUrl) => {
  try {
    Assert.string(fontName)
    Assert.string(fontUrl)
    if (fontName.startsWith('\'')) {
      throw new Error('font name is not allowed start with quotes')
    }
    const fontFace = new FontFace(fontName, fontUrl, {})
    await fontFace.load()
    const fonts = getFonts()
    // @ts-ignore
    fonts.add(fontFace)
  } catch (error) {
    throw new VError(error, `Failed to load font ${fontName}`)
  }
}

export const ensure = async (fontName, fontUrl) => {
  if (FontState.isLoaded(fontName)) {
    return
  }
  if (FontState.hasPending(fontName)) {
    return FontState.getPending(fontName)
  }
  const promise = load(fontName, fontUrl)
  FontState.setPending(fontName, promise)
  await promise
  FontState.removePending(fontName)
}
