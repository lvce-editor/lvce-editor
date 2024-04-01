import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.js'
import * as ViewletFindWidgetFunctions from './ViewletFindWidgetFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletFindWidgetFunctions.handleInput(uid, value)
}

const handleClickClose = (uid, event) => {
  Event.preventDefault(event)
  ViewletFindWidgetFunctions.close(uid)
}

const handleClickPreviousMatch = (uid, event) => {
  Event.preventDefault(event)
  ViewletFindWidgetFunctions.focusPrevious(uid)
}

const handleClickNextMatch = (uid, event) => {
  Event.preventDefault(event)
  ViewletFindWidgetFunctions.focusNext(uid)
}

const handleClickToggleReplace = (uid, event) => {
  Event.preventDefault(event)
  ViewletFindWidgetFunctions.toggleReplace(uid)
}

export const handleClick = (event) => {
  const { target } = event
  const { title } = target
  const uid = ComponentUid.fromEvent(event)
  switch (title) {
    case 'Close':
      handleClickClose(uid, event)
      break
    case 'Previous Match':
      handleClickPreviousMatch(uid, event)
      break
    case 'Next Match':
      handleClickNextMatch(uid, event)
      break
    case 'Toggle Replace':
      handleClickToggleReplace(uid, event)
      break
    default:
      break
  }
}

export const handleInputBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletFindWidgetFunctions.handleBlur(uid)
}

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletFindWidgetFunctions.handleFocus(uid)
}
