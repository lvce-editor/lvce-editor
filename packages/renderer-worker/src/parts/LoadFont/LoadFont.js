import * as Assert from '../Assert/Assert.ts'
import * as GetFonts from '../GetFonts/GetFonts.js'
import { VError } from '../VError/VError.js'

export const loadFont = async (fontName, fontUrl) => {
  try {
    Assert.string(fontName)
    Assert.string(fontUrl)
    if (fontName.startsWith("'")) {
      throw new Error('font name is not allowed start with quotes')
    }
    const fontFace = new FontFace(fontName, fontUrl, {})
    await fontFace.load()
    const fonts = GetFonts.getFonts()
    // @ts-ignore
    fonts.add(fontFace)
  } catch (error) {
    throw new VError(error, `Failed to load font ${fontName}`)
  }
}
