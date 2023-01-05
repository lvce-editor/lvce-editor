import { VError } from '../VError/VError.js'
import * as Assert from '../Assert/Assert.js'

const getFonts = () => {
  // @ts-ignore
  return globalThis.fonts || document.fonts
}

export const has = (fontName, fontSize) => {
  const fonts = getFonts()
  return fonts.check(`${fontSize}px ${fontName}`)
}

export const load = async (fontName, fontUrl) => {
  try {
    Assert.string(fontName)
    Assert.string(fontUrl)
    if (fontName.startsWith(`'`)) {
      throw new Error(`font name is not allowed start with quotes`)
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
