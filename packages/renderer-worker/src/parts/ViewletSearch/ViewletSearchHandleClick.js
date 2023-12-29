import * as ViewletSearchSelectIndex from './ViewletSearchSelectIndex.js'
import * as ViewletSearchToggleMatchCase from './ViewletSearchToggleMatchCase.js'
import * as ViewletSearchToggleMatchWholeWord from './ViewletSearchToggleMatchWholeWord.js'
import * as ViewletSearchToggleReplace from './ViewletSearchToggleReplace.js'
import * as ViewletSearchToggleUseRegularExpression from './ViewletSearchToggleUseRegularExpression.js'

export const handleClick = (state, index) => {
  const { minLineY } = state
  const actualIndex = index + minLineY
  return ViewletSearchSelectIndex.selectIndex(state, actualIndex)
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
