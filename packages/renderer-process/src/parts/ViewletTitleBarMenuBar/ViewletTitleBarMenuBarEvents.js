import * as FindIndex from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const isInsideTitleBarMenu = ($Element) => {
  return $Element.classList.contains('MenuItem') || $Element.classList.contains('Menu') || $Element.classList.contains('TitleBarTopLevelEntry')
}

export const handleFocusOut = (event) => {
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    return
  }
  RendererWorker.send(/* TitleBarMenuBar.closeMenu */ 'TitleBarMenuBar.closeMenu', /* keepFocus */ false)
}

export const handlePointerOver = (event) => {
  const { target } = event
  const index = getIndex(target)
  RendererWorker.send(/* TitleBarMenuBar.focusIndex */ 'TitleBarMenuBar.handleMouseOver', /* index */ index)
}

export const handlePointerOut = (event) => {
  const { target } = event
  const index = getIndex(target)
  RendererWorker.send(/* TitleBarMenuBar.handleMouseOut */ 'TitleBarMenuBar.handleMouseOut', /* index */ index)
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
  const index = getIndex(target)
  RendererWorker.send('TitleBarMenuBar.handleClick', button, index)
}

const getLevelAndIndex = (event) => {
  const { target } = event
  const $Menu = target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, target)
  const { id } = $Menu
  const level = Number.parseInt(id.slice(5))
  return {
    level,
    index,
  }
}

export const handleMenuMouseOver = (event) => {
  // TODO just send pixel coordinates instead
  const { level, index } = getLevelAndIndex(event)
  RendererWorker.send(/* TitleBarMenuBar.handleMenuMouseOver */ 'TitleBarMenuBar.handleMenuMouseOver', /* level */ level, /* index */ index)
}

export const handleMenuMouseDown = (event) => {
  const { level, index } = getLevelAndIndex(event)
  RendererWorker.send(/* TitleBarMenuBar.handleMenuMouseDown */ 'TitleBarMenuBar.handleMenuMouseDown', /* level */ level, /* index */ index)
}

export const handleFocus = () => {
  Focus.setFocus('TitleBarMenuBar')
}
