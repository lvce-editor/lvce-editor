import * as FontState from '../FontState/FontState.ts'
import * as LoadFont from '../LoadFont/LoadFont.ts'

export const load = async (fontName: string, fontUrl: string) => {
  return LoadFont.loadFont(fontName, fontUrl)
}

export const ensure = async (fontName: string, fontUrl: string) => {
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
