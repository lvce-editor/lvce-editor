import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletSearchFunctions from './ViewletSearchFunctions.ts'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  return ['handleInput', value, InputSource.User]
}

export const handleFocus = (event) => {
  // TODO send focus event to search view first
  return ['Focus.setFocus', WhenExpression.FocusSearchInput]
}

const getIndexTreeItem = ($Target) => {
  return GetNodeIndex.getNodeIndex($Target)
}

const getIndexLabel = ($Target) => {
  return GetNodeIndex.getNodeIndex($Target.parentNode)
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
    return []
  }
  const index = getIndex(target)
  return ['handleClick', index]
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleScrollBarMove(uid, clientY)
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  PointerEvents.startTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerUp)
  return ['handleScrollBarClick', clientY]
}

export const handleToggleButtonClick = (event) => {
  return ['toggleReplace']
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const { title } = target
  switch (title) {
    case 'Toggle Replace':
      return ['toggleReplace']
    case 'Match Case':
      return ['toggleMatchCase']
    case 'Use Regular Expression':
      return ['toggleUseRegularExpression']
    case 'Replace All':
      return ['replaceAll']
    case 'Match Whole Word':
      return ['toggleMatchWholeWord']
    default:
      return []
  }
  // TODO better way to determine which button was clicked
}

export const handleReplaceInput = (event) => {
  const { target } = event
  const { value } = target
  return ['handleReplaceInput', value]
}

export const handleListFocus = (event) => {
  return ['handleListFocus']
}

export const handleListBlur = (event) => {
  return ['handleListBlur']
}

export const handleHeaderFocusIn = (event) => {
  const { target } = event
  const key = target.name || target.title
  if (!key) {
    return []
  }
  return ['handleFocusIn', key]
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  return ['handleContextMenu', button, clientX, clientY]
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  return ['handleWheel', deltaMode, deltaY]
}

export const returnValue = true
