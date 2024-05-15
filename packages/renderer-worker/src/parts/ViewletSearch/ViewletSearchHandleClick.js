import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.js'

export const handleClick = (state, index) => {
  const { minLineY } = state
  const actualIndex = index + minLineY
  return ViewletSearchSelectIndex.selectIndex(state, actualIndex)
}

export const handleClickAt = (state, eventX, eventY) => {
  const { y, itemHeight } = state
  const top = 94.19 // TODO search store boxes height integer
  const relativeY = eventY - y - top
  const relativeIndex = Math.floor(relativeY / itemHeight)
  return handleClick(state, relativeIndex)
}
