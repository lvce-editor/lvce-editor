import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as MouseEventTypes from '../MouseEventType/MouseEventType.js'

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu') ||
    $Element.classList.contains('TitleBarTopLevelEntry')
  )
}

export const handleFocusOut = (event) => {
  console.log('title bar focus out', event.relatedTarget)
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    console.log('RETURN')
    return
  }
  RendererWorker.send(
    /* TitleBarMenuBar.closeMenu */ 'TitleBarMenuBar.closeMenu',
    /* keepFocus */ false
  )
}

// TODO should only have the one listener in KeyBindings.js
export const handleKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyArrowDown */ 'TitleBarMenuBar.handleKeyArrowDown'
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyArrowUp */ 'TitleBarMenuBar.handleKeyArrowUp'
      )
      break
    case 'ArrowRight':
      console.log('arrow right')
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyArrowRight */ 'TitleBarMenuBar.handleKeyArrowRight'
      )
      break
    case 'ArrowLeft':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyArrowLeft */ 'TitleBarMenuBar.handleKeyArrowLeft'
      )
      break
    case 'Enter':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyEnter */ 'TitleBarMenuBar.handleKeyEnter'
      )
      break
    case ' ':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeySpace */ 'TitleBarMenuBar.handleKeySpace'
      )
      break
    case 'Home':
    case 'PageUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyHome */ 'TitleBarMenuBar.handleKeyHome'
      )
      break
    case 'End':
    case 'PageDown':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyEnd */ 'TitleBarMenuBar.handleKeyEnd'
      )
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenuBar.handleKeyEscape */ 'TitleBarMenuBar.handleKeyEscape'
      )
      break
    default:
      break
  }
}

export const handleMouseEnter = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  const enterX = event.clientX
  const enterY = event.clientY
  RendererWorker.send(
    /* TitleBarMenuBar.focusIndex */ 'TitleBarMenuBar.focusIndex',
    /* index */ index,
    /* enterX */ enterX,
    /* enterY */ enterY
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
  if (event.button !== MouseEventTypes.LeftClick) {
    return
  }
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  // event.preventDefault()
  RendererWorker.send(
    /* TitleBarMenuBar.toggleIndex */ 'TitleBarMenuBar.toggleIndex',
    /* index */ index
  )
}
