import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

const DEFAULT_ICON_SRC = '/icons/extensionDefaultIcon.png'
const DEFAULT_ICON_LANGUAGE_BASICS = '/icons/language-icon.svg'
const DEFAULT_ICON_THEME = '/icons/theme-icon.png'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(
    /* ViewletExtensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove',
    /* y */ clientY
  )
}

export const handleScrollBarThumbPointerUp = () => {
  window.removeEventListener('pointermove', handleScrollBarThumbPointerMove)
  window.removeEventListener('pointerup', handleScrollBarThumbPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const $Target = event.target
  if ($Target.className === 'ScrollBarThumb') {
    window.addEventListener('pointermove', handleScrollBarThumbPointerMove)
    window.addEventListener('pointerup', handleScrollBarThumbPointerUp)
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

const handlePointerDownExtension = ($Target) => {
  const index = getNodeIndex($Target)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

const handlePointerDownExtensionDetail = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

const handlePointerDownExtensionAuthorName = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

export const handlePointerDown = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'Extension':
      handlePointerDownExtension($Target)
      break
    case 'ExtensionName':
    case 'ExtensionDescription':
    case 'ExtensionFooter':
      handlePointerDownExtensionDetail($Target)
      break
    case 'ExtensionAuthorName':
      handlePointerDownExtensionAuthorName($Target)
      break
    default:
      break
  }
}

const handleContextMenuMouse = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send(
    /* Extensions.handleContextMenu */ 'Extensions.handleContextMenu',
    /* x */ clientX,
    /* y */ clientY
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

export const handleScroll = (event) => {
  console.log(event)
}

/**
 *
 * @param {TouchList} touchList
 */
const toArray = (touchList) => {
  const touchArray = []
  // @ts-ignore
  for (const item of touchList) {
    touchArray.push({
      clientX: item.clientX,
      clientY: item.clientY,
      identifier: item.identifier,
    })
  }
  return touchArray
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchMove = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send(
    'Extensions.handleTouchMove',
    timeStamp,
    changedTouchesArray
  )
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchStart = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send(
    'Extensions.handleTouchStart',
    timeStamp,
    changedTouchesArray
  )
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchEnd = (event) => {
  const { changedTouches } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send('Extensions.handleTouchEnd', changedTouchesArray)
}
