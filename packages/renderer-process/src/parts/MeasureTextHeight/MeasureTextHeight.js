import * as Assert from '../Assert/Assert.ts'

export const measureTextHeight = (text, fontSize, fontFamily) => {
  Assert.string(text)
  Assert.string(fontSize)
  Assert.string(fontFamily)
  const $Measure = document.createElement('div')
  $Measure.style.position = 'absolute'
  $Measure.style.top = '-9999px'
  $Measure.style.left = '-9999px'
  $Measure.textContent = text
  document.body.append($Measure)
  const height = $Measure.offsetHeight
  $Measure.remove()
  return height
}
