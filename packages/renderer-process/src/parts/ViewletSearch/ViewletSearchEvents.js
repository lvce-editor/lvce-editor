import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletSearchFunctions from './ViewletSearchFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleInput(uid, value)
}

export const handleFocus = (event) => {
  Focus.setFocus('SearchInput')
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndexTreeItem = ($Target) => {
  return getNodeIndex($Target)
}

const getIndexLabel = ($Target) => {
  return getNodeIndex($Target.parentNode)
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'TreeItem':
      return getIndexTreeItem($Target)
    case 'Label':
      return getIndexLabel($Target)
    default:
      return -1
  }
}

export const handleClick = (event) => {
  const { target, button } = event
  if (button === MouseEventType.RightClick) {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  const index = getIndex(target)
  ViewletSearchFunctions.handleClick(uid, index)
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  const { button, clientX, clientY } = event
  ViewletSearchFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleScrollBarMove(uid, clientY)
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
  target.removeEventListener(DomEventType.PointerUp, handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.PointerUp, handleScrollBarPointerUp)
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleScrollBarClick(uid, clientY)
}

export const handleToggleButtonClick = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.toggleReplace(uid)
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const { title } = target
  const uid = ComponentUid.fromEvent(event)
  switch (title) {
    case 'Toggle Replace':
      ViewletSearchFunctions.toggleReplace(uid)
      break
    case 'Match Case':
      ViewletSearchFunctions.toggleMatchCase(uid)
      break
    case 'Use Regular Expression':
      ViewletSearchFunctions.toggleUseRegularExpression(uid)
      break
    case 'Replace All':
      ViewletSearchFunctions.replaceAll(uid)
      break
    case 'Match Whole Word':
      ViewletSearchFunctions.toggleMatchWholeWord(uid)
      break
    default:
      break
  }
  // TODO better way to determine which button was clicked
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleWheel(uid, deltaMode, deltaY)
}

export const handleReplaceInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleReplaceInput(uid, value)
}

export const handleListFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleListFocus(uid)
}

export const handleListBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleListBlur(uid)
}
