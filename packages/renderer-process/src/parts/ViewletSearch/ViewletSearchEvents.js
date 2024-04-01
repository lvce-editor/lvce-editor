import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as InputSource from '../InputSource/InputSource.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as PointerEvents from '../PointerEvents/PointerEvents.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ViewletSearchFunctions from './ViewletSearchFunctions.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleInput(uid, value, InputSource.User)
}

export const handleFocus = (event) => {
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusSearchInput)
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
    return
  }
  const uid = ComponentUid.fromEvent(event)
  const index = getIndex(target)
  ViewletSearchFunctions.handleClick(uid, index)
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

export const handleHeaderFocusIn = (event) => {
  const { target } = event
  const key = target.name || target.title
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleFocusIn(uid, key)
}

export * from '../ContextMenuEvents/ContextMenuEvents.js'
export * from '../VirtualListEvents/VirtualListEvents.js'
