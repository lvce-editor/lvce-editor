import * as Event from '../Event/Event.ts'

export const handleClickOk = (event) => {
  return ['handleClickOk']
}

export const handleClickClose = (event) => {
  return ['handleClickClose']
}

export const handleClickCopy = (event) => {
  return ['handleClickCopy']
}

export const handleFocusIn = (event) => {
  return ['handleFocusIn']
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  return []
}

export const returnValue = true
