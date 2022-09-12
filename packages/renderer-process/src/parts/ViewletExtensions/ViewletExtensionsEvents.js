import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

const DEFAULT_ICON_SRC = '/icons/extensionDefaultIcon.png'
const DEFAULT_ICON_LANGUAGE_BASICS = '/icons/language-icon.svg'
const DEFAULT_ICON_THEME = '/icons/theme-icon.png'

export const handleScrollBarThumbMouseMove = (event) => {
  const y = event.clientY
  RendererWorker.send(
    /* ViewletExtensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove',
    /* y */ y
  )
}

export const handleScrollBarThumbMouseUp = () => {
  window.removeEventListener('mousemove', handleScrollBarThumbMouseMove)
  window.removeEventListener('mouseup', handleScrollBarThumbMouseUp)
}

export const handleScrollBarMouseDown = (event) => {
  const $Target = event.target
  if ($Target.className === 'ScrollBarThumb') {
    window.addEventListener('mousemove', handleScrollBarThumbMouseMove)
    window.addEventListener('mouseup', handleScrollBarThumbMouseUp)
  } else {
    const y = event.clientY
    console.log({ y })
    RendererWorker.send(
      /* ViewletExtensions.handleScrollBarClick */ 'Extensions.handleScrollBarClick',
      /* y */ y
    )
  }
}

export const handleFocus = (event) => {
  Focus.setFocus('Extensions')
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

export const handleClick = (event) => {
  const $Target = event.target
  console.log($Target)
  switch ($Target.className) {
    case 'Extension': {
      const index = getNodeIndex($Target)
      RendererWorker.send(
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index
      )
      break
    }
    case 'ExtensionName':
    case 'ExtensionDescription':
    case 'ExtensionFooter': {
      const index = getNodeIndex($Target.parentNode.parentNode)
      RendererWorker.send(
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index
      )
      break
    }
    case 'ExtensionAuthorName': {
      const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
      RendererWorker.send(
        /* Extensions.handleClick */ 'Extensions.handleClick',
        /* index */ index
      )
      break
    }
    default:
      break
  }
}

const handleContextMenuMouse = (event) => {
  RendererWorker.send(
    /* Extensions.handleContextMenu */ 'Extensions.handleContextMenu',
    /* x */ event.clientX,
    /* y */ event.clientY
  )
}

const handleContextMenuKeyboard = (event) => {}

export const handleContextMenu = (event) => {
  event.preventDefault()
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

export const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    default:
      break
  }
}

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* ViewletExtensions.handleInput */ 'Extensions.handleInput',
    /* value */ value
  )
  // TODO
  // TODO use beforeinput event to set value and extension list items at the same time
  // state.$Viewlet.ariaBusy = 'true'
}

export const handleIconError = (event) => {
  const $Target = event.target
  if ($Target.src.endsWith(DEFAULT_ICON_SRC)) {
    return
  }
  $Target.src = DEFAULT_ICON_SRC
}
