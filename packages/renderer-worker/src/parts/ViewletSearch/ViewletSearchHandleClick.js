import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.js'
import * as ViewletSearchToggleReplace from './ViewletSearchToggleReplace.js'

export const handleClick = (state, x, y) => {
  const { minLineY } = state
  // const actualIndex = index + minLineY
  // return ViewletSearchSelectIndex.selectIndex(state, actualIndex)
  return state
}

export const handleCommand = (state, command) => {
  switch (command) {
    case 'toggleReplace':
      return ViewletSearchToggleReplace.toggleReplace(state)
    default:
      return state
  }
}
