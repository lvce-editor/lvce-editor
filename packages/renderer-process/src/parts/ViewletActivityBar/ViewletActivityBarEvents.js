import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as Layout from '../Layout/Layout.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActvityBarItemFlags.js'
import * as MouseEventTypes from '../MouseEventType/MouseEventType.js'

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
  RendererWorker.send(
    /* ActivityBar.handleClick */ 'ActivityBar.handleClick',
    /* index */ index,
    /* x */ x,
    /* y */ y
  )
}

export const handleContextMenu = (event) => {
  event.preventDefault()
  // TODO also move side bar position command
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* activityBarHandleContextMenu */ 'ActivityBar.handleContextMenu',
    /* x */ x,
    /* y */ y
  )
}

export const handleBlur = () => {}

export const handleFocusIn = () => {
  Focus.setFocus('activityBar')
}
