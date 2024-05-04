import * as FindIndex from '../FindIndex/FindIndex.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu') ||
    $Element.classList.contains('TitleBarTopLevelEntry') ||
    $Element.classList.contains('TitleBarMenuBar')
  )
}

export const handleFocusOut = (event) => {
  const { target, relatedTarget } = event
  if (relatedTarget && isInsideTitleBarMenu(relatedTarget)) {
    return []
  }
  if (target && isInsideTitleBarMenu(target)) {
    return []
  }
  return ['closeMenu']
}

export const handlePointerOver = (event) => {
  const { target } = event
  const index = getIndex(target)
  return ['handleMouseOver', index]
}

export const handlePointerOut = (event) => {
  const { target } = event
  const index = getIndex(target)
  return ['handleMouseOut', index]
}

const getIndex = ($Target) => {
  if ($Target.classList.contains('TitleBarTopLevelEntry')) {
    return GetNodeIndex.getNodeIndex($Target)
  }
  return -1
}

export const handleClick = (event) => {
  const { button, target } = event
  const index = getIndex(target)
  return ['handleClick', button, index]
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
  return ['handleMenuMouseOver', level, index]
}

export const handleMenuClick = (event) => {
  const { level, index } = getLevelAndIndex(event)
  return ['handleMenuClick', level, index]
}

export const handleFocusIn = (event) => {
  return ['handleFocus']
}

export const returnValue = true
