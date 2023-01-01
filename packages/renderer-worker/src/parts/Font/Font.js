import { VError } from '../VError/VError.js'

export const load = async (fontSize, fontFamily) => {
  try {
    await fonts.load(`${fontSize}px ${fontFamily}`, '')
  } catch (error) {
    throw new VError(error, `Failed to load font ${fontFamily}`)
  }
}
