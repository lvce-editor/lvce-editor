import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.ts'

const handleClickOutside = (state) => {
  return {
    ...state,
    listFocusedIndex: -1,
    listFocused: true,
  }
}

export const handleClick = (state, index, isClose) => {
  const { minLineY, items } = state
  const actualIndex = index + minLineY
  const isOutside = actualIndex > items.length
  if (isOutside) {
    return handleClickOutside(state)
  }
  return ViewletSearchSelectIndex.selectIndex(state, actualIndex, isClose)
}

export const handleClickAt = (state, eventX, eventY) => {
  await TextSearchWorker.invoke('TextSearch.handleClickAt', state.uid, eventX, eventY)
  const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
  return {
    ...state,
    commands,
  }
  async
  const { y, itemHeight, x, width, replaceExpanded } = state
  const top = replaceExpanded ? 94.19 : 57 // TODO search store boxes height integer
  const relativeY = eventY - y - top
  const relativeX = eventX - x
  const relativeIndex = Math.floor(relativeY / itemHeight)
  const paddingRight = 10
  const closeButtonSize = 20
  const isClose = width - relativeX - paddingRight < closeButtonSize
  return handleClick(state, relativeIndex, isClose)
}
