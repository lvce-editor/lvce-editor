import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletFindWidgetFunctions from './ViewletFindWidgetFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletFindWidgetFunctions.handleInput(value)
}

const handleClickClose = (event) => {
  Event.preventDefault(event)
  ViewletFindWidgetFunctions.close()
}

const handleClickPreviousMatch = (event) => {
  event.preventDefault()
  ViewletFindWidgetFunctions.focusPrevious()
}

const handleClickNextMatch = (event) => {
  event.preventDefault()
  ViewletFindWidgetFunctions.focusNext()
}

export const handleClick = (event) => {
  const { target } = event
  const { title } = target
  switch (title) {
    case 'Close':
      handleClickClose(event)
      break
    case 'Previous Match':
      handleClickPreviousMatch(event)
      break
    case 'Next Match':
      handleClickNextMatch(event)
      break
    default:
      break
  }
}

export const handleInputBlur = (event) => {
  Focus.setFocus('')
}

export const handleFocus = (event) => {
  Focus.setFocus('FindWidget')
}
