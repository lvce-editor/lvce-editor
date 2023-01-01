import { VError } from '../VError/VError.js'

const getFonts = () => {
  // @ts-ignore
  return self.fonts || document.fonts
}

export const load = async (fontSize, fontFamily) => {
  try {
    const fonts = getFonts()
    await fonts.load(`${fontSize}px ${fontFamily}`, '')
  } catch (error) {
    throw new VError(error, `Failed to load font ${fontFamily}`)
  }
}
