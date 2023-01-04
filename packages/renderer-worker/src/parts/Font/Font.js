import { VError } from '../VError/VError.js'
import * as Assert from '../Assert/Assert.js'

export const load = async (fontName, fontUrl) => {
  try {
    Assert.string(fontName)
    Assert.string(fontUrl)
    const fontFace = new FontFace(fontName, fontUrl, {})
    await fontFace.load()
    self.fonts.add(fontFace)
    console.log('added font')
  } catch (error) {
    throw new VError(error, `Failed to load font ${fontName}`)
  }
}
