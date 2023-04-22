import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletActivityBarFunctions from './ViewletActivityBarFunctions.js'

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

export const handleMousedown = (event) => {
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

export const handleContextMenu = (event) => {
  const { button, clientX, clientY } = event
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletActivityBarFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletActivityBarFunctions.handleBlur(uid)
}

export const handleFocus = (event) => {
  Focus.setFocus('activityBar')
  const uid = ComponentUid.fromEvent(event)
  ViewletActivityBarFunctions.handleFocus(uid)
}
