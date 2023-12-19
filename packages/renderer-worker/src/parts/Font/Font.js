import * as FontState from '../FontState/FontState.js'
import * as LoadFont from '../LoadFont/LoadFont.js'

export const load = async (fontName, fontUrl) => {
  return LoadFont.loadFont(fontName, fontUrl)
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
