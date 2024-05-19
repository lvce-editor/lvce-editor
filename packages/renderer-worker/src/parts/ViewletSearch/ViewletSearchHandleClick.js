import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.js'

export const handleClick = (state, index, isClose) => {
  const { minLineY } = state
  const actualIndex = index + minLineY
  return ViewletSearchSelectIndex.selectIndex(state, actualIndex, isClose)
}

export const handleClickAt = (state, eventX, eventY) => {
  const { y, itemHeight, x, width } = state
  const top = 94.19 // TODO search store boxes height integer
  const relativeY = eventY - y - top
  const relativeX = eventX - x
  const relativeIndex = Math.floor(relativeY / itemHeight)
  const paddingRight = 10
  const closeButtonSize = 20
  const isClose = width - relativeX - paddingRight < closeButtonSize
  return handleClick(state, relativeIndex, isClose)
}
