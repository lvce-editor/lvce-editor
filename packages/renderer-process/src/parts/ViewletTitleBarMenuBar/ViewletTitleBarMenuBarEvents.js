import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as MouseEventTypes from '../MouseEventType/MouseEventType.js'
import * as Focus from '../Focus/Focus.js'

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu') ||
    $Element.classList.contains('TitleBarTopLevelEntry')
  )
}

export const handleFocusOut = (event) => {
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    return
  }
  RendererWorker.send(
    /* TitleBarMenuBar.closeMenu */ 'TitleBarMenuBar.closeMenu',
    /* keepFocus */ false
  )
}

export const handleMouseEnter = (event) => {
  const { target, clientX, clientY } = event
  const index = getIndex(target)
  if (index === -1) {
    return
  }
  RendererWorker.send(
    /* TitleBarMenuBar.focusIndex */ 'TitleBarMenuBar.handleMouseEnter',
    /* index */ index,
    /* enterX */ clientX,
    /* enterY */ clientY
  )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'TitleBarTopLevelEntry':
      return getNodeIndex($Target)
    default:
      return -1
  }
}

export const handleClick = (event) => {
  const { button, target } = event
  if (button !== MouseEventTypes.LeftClick) {
    return
  }
  const index = getIndex(target)
  if (index === -1) {
    return
  }
  console.log({ index })
  // event.preventDefault()
  RendererWorker.send(
    /* TitleBarMenuBar.toggleIndex */ 'TitleBarMenuBar.toggleIndex',
    /* index */ index
  )
}

export const handleFocus = () => {
  Focus.setFocus('TitleBarMenuBar')
}
