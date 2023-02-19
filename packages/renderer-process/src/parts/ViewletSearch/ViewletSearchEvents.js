import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as ViewletSearchFunctions from './ViewletSearchFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSearchFunctions.handleInput(value)
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
  const index = getIndex(target)
  ViewletSearchFunctions.handleClick(index)
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  ViewletSearchFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  ViewletSearchFunctions.handleScrollBarMove(clientY)
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
  ViewletSearchFunctions.handleScrollBarClick(clientY)
}

export const handleToggleButtonClick = (event) => {
  ViewletSearchFunctions.toggleReplace()
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const { title } = target
  switch (title) {
    case 'Toggle Replace':
      ViewletSearchFunctions.toggleReplace()
      break
    case 'Match Case':
      ViewletSearchFunctions.toggleMatchCase()
      break
    case 'Use Regular Expression':
      ViewletSearchFunctions.toggleUseRegularExpression()
      break
    case 'Replace All':
      ViewletSearchFunctions.replaceAll()
      break
    case 'Match Whole Word':
      ViewletSearchFunctions.toggleMatchWholeWord()
      break
    default:
      break
  }
  // TODO better way to determine which button was clicked
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      ViewletSearchFunctions.handleWheel(deltaY)
      break
    default:
      break
  }
}

export const handleReplaceInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSearchFunctions.handleReplaceInput(value)
}
