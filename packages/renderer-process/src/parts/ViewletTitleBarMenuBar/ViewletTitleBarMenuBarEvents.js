import * as FindIndex from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletTitleBarMenuBarFunctions from './ViewletTitleBarMenuBarFunctions.js'

const isInsideTitleBarMenu = ($Element) => {
  return $Element.classList.contains('MenuItem') || $Element.classList.contains('Menu') || $Element.classList.contains('TitleBarTopLevelEntry')
}

export const handleFocusOut = (event) => {
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    return
  }
  ViewletTitleBarMenuBarFunctions.closeMenu()
}

export const handlePointerOver = (event) => {
  const { target } = event
  const index = getIndex(target)
  ViewletTitleBarMenuBarFunctions.handleMouseOver(index)
}

export const handlePointerOut = (event) => {
  const { target } = event
  const index = getIndex(target)
  ViewletTitleBarMenuBarFunctions.handleMouseOut(index)
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
  ViewletTitleBarMenuBarFunctions.handleClick(button, index)
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
  ViewletTitleBarMenuBarFunctions.handleMenuMouseOver(level, index)
}

export const handleMenuClick = (event) => {
  const { level, index } = getLevelAndIndex(event)
  ViewletTitleBarMenuBarFunctions.handleMenuClick(level, index)
}

export const handleFocus = () => {
  Focus.setFocus('TitleBarMenuBar')
}
