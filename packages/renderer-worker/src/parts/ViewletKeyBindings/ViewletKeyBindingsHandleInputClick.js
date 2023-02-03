import * as GetAccurateColumnIndex from '../GetAccurateColumnIndex/GetAccurateColumnIndex.js'

export const handleInputClick = (state, x, y) => {
  // console.log({ state })
  const { value } = state
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'system-ui'
  const letterSpacing = 'normal'
  const columnIndex = GetAccurateColumnIndex.getAccurateColumnIndex(value, fontWeight, fontSize, fontFamily, letterSpacing, x)
  // const offset = MeasureTextWidth.measureTextWidth
  console.log({ x, y, columnIndex })
  // TODO
  return {
    ...state,
    inputFocused: true,
  }
}
