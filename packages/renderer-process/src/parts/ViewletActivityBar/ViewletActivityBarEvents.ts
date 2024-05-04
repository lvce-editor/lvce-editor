import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as ContextMenuFunctions from '../ContextMenuFunctions/ContextMenuFunctions.ts'
import * as Event from '../Event/Event.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletActivityBarFunctions from './ViewletActivityBarFunctions.ts'

const get$ItemFromEvent = (event) => {
  const $Target = event.target
  if ($Target.classList.contains('ActivityBarItem')) {
    return $Target
  }
  if ($Target.classList.contains('ActivityBarItemIcon')) {
    return $Target.parentNode
  }
  return undefined
}

export const handleMouseDown = (event) => {
  const { button, clientX, clientY } = event
  const $Item = get$ItemFromEvent(event)
  if (!$Item) {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  Event.preventDefault(event)
  Event.stopPropagation(event)
  const index = GetNodeIndex.getNodeIndex($Item)
  ViewletActivityBarFunctions.handleClick(uid, button, index, clientX, clientY)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletActivityBarFunctions.handleBlur(uid)
}

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletActivityBarFunctions.handleFocus(uid)
}

// TODO use context menu events function again

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ContextMenuFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const returnValue = true
