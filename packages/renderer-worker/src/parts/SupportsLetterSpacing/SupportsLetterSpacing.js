import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as Platform from '../Platform/Platform.js'

// workaround for firefox not supporting letterspacing https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
export const supportsLetterSpacing = () => {
  if (!Platform.isFirefox) {
    return true
  }
  const text = 'abc'
  const fontWeight = 100
  const fontSize = 16
  const fontFamily = 'serif'
  const noLetterSpacing = 0
  const largeLetterSpacing = 100
  const normalTextWidth = MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, noLetterSpacing)
  const largeTextWidth = MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, largeLetterSpacing)
  return normalTextWidth === largeTextWidth
}
