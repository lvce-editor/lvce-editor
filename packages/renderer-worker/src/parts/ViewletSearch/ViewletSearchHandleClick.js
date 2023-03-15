import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.js'

export const handleClick = (state, index) => {
  const { minLineY } = state
  const actualIndex = index + minLineY
  return ViewletSearchSelectIndex.selectIndex(state, actualIndex)
}
