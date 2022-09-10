import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu')
  )
}

export const handleFocusOut = (event) => {
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    console.log('RETURN')
    return
  }
  RendererWorker.send(
    /* TitleBarMenu.closeMenu */ 'TitleBarMenuBar.closeMenu',
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
        /* TitleBarMenu.handleKeyArrowDown */ 'TitleBarMenu.handleKeyArrowDown'
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyArrowUp */ 'TitleBarMenu.handleKeyArrowUp'
      )
      break
    case 'ArrowRight':
      console.log('arrow right')
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyArrowRight */ 'TitleBarMenu.handleKeyArrowRight'
      )
      break
    case 'ArrowLeft':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyArrowLeft */ 'TitleBarMenu.handleKeyArrowLeft'
      )
      break
    case 'Enter':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyEnter */ 'TitleBarMenu.handleKeyEnter'
      )
      break
    case ' ':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeySpace */ 'TitleBarMenu.handleKeySpace'
      )
      break
    case 'Home':
    case 'PageUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyHome */ 'TitleBarMenu.handleKeyHome'
      )
      break
    case 'End':
    case 'PageDown':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyEnd */ 'TitleBarMenu.handleKeyEnd'
      )
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send(
        /* TitleBarMenu.handleKeyEscape */ 'TitleBarMenu.handleKeyEscape'
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
    /* TitleBarMenu.focusIndex */ 'TitleBarMenuBar.focusIndex',
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
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  // event.preventDefault()
  RendererWorker.send(
    /* TitleBarMenu.toggleIndex */ 'TitleBarMenuBar.toggleIndex',
    /* index */ index
  )
}
