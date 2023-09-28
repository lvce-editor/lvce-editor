import * as IsFirefox from '../IsFirefox/IsFirefox.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'

// workaround for firefox not supporting letterspacing https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/letterSpacing
export const supportsLetterSpacing = () => {
  if (!IsFirefox.isFirefox) {
    return true
  }
  const text = 'abc'
  const fontWeight = 100
  const fontSize = 16
  const fontFamily = 'serif'
  const noLetterSpacing = 0
  const largeLetterSpacing = 100
  const isMonospaceFont = false
  const charWidth = 0
  const normalTextWidth = MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, noLetterSpacing, isMonospaceFont, charWidth)
  const largeTextWidth = MeasureTextWidth.measureTextWidth(text, fontWeight, fontSize, fontFamily, largeLetterSpacing, isMonospaceFont, charWidth)
  return normalTextWidth !== largeTextWidth
}
