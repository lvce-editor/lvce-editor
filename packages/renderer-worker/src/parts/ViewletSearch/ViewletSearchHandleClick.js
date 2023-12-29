import * as ViewletSearchToggleMatchCase from './ViewletSearchToggleMatchCase.js'
import * as ViewletSearchToggleMatchWholeWord from './ViewletSearchToggleMatchWholeWord.js'
import * as ViewletSearchToggleUseRegularExpression from './ViewletSearchToggleUseRegularExpression.js'
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
    case 'toggleMatchCase':
      return ViewletSearchToggleMatchCase.toggleMatchCase(state)
    case 'toggleMatchWholeWord':
      return ViewletSearchToggleMatchWholeWord.toggleMatchWholeWord(state)
    case 'toggleUseRegularExpression':
      return ViewletSearchToggleUseRegularExpression.toggleUseRegularExpression(state)
    default:
      return state
  }
}
