import * as Focus from '../Focus/Focus.js'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.js'
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
  if (event.button !== MouseEventTypes.LeftClick) {
    return
  }
  const $Item = get$ItemFromEvent(event)
  if (!$Item) {
    return
  }
  event.preventDefault()
  event.stopPropagation()
  const index = getNodeIndex($Item)
  const x = event.clientX
  const y = event.clientY
  ViewletActivityBarFunctions.handleClick(index, x, y)
}

export const handleContextMenu = (event) => {
  HandleContextMenu.handleContextMenu('ActivityBar.handleContextMenu', event)
}

export const handleBlur = () => {
  RendererWorker.send('ActivityBar.handleBlur')
  ViewletActivityBarFunctions.handleBlur()
}

export const handleFocus = (event) => {
  Focus.setFocus('activityBar')
  ViewletActivityBarFunctions.handleFocus()
}
