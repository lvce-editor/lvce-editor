import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as MouseEventTypes from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ViewletActivityBarFunctions from './ViewletActivityBarFunctions.js'

const get$ItemFromEvent = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'ActivityBarItemIcon':
      return $Target.parentNode
    case 'ActivityBarItem':
      return $Target
    default:
      return undefined
  }
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

export const handleMousedown = (event) => {
  const { button, clientX, clientY } = event
  if (button !== MouseEventTypes.LeftClick) {
    return
  }
  const $Item = get$ItemFromEvent(event)
  if (!$Item) {
    return
  }
  Event.preventDefault(event)
  Event.stopPropagation(event)
  const index = getNodeIndex($Item)
  ViewletActivityBarFunctions.handleClick(index, clientX, clientY)
}

export const handleContextMenu = (event) => {
  const { button, clientX, clientY } = event
  Event.preventDefault(event)
  ViewletActivityBarFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleBlur = () => {
  RendererWorker.send('ActivityBar.handleBlur')
  ViewletActivityBarFunctions.handleBlur()
}

export const handleFocus = (event) => {
  Focus.setFocus('activityBar')
  ViewletActivityBarFunctions.handleFocus()
}
