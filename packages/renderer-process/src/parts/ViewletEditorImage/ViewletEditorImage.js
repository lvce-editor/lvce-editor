import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletEditorImageEvents from './ViewletEditorImageEvents.js'

export const create = () => {
  const $Image = document.createElement('img')
  $Image.className = 'ViewletImage'
  $Image.draggable = false

  const $ImageWrapper = document.createElement('div')
  $ImageWrapper.className = 'ImageWrapper'
  $ImageWrapper.tabIndex = 0
  $ImageWrapper.append($Image)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorImage'
  $Viewlet.append($ImageWrapper)

  return {
    $Viewlet,
    $Image,
    $ImageWrapper,
  }
}

export const attachEvents = (state) => {
  const { $Image, $ImageWrapper, $Viewlet } = state
  AttachEvents.attachEvents($Image, {
    [DomEventType.Error]: ViewletEditorImageEvents.handleError,
  })
  AttachEvents.attachEvents($ImageWrapper, {
    [DomEventType.Focus]: ViewletEditorImageEvents.handleFocus,
  })
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.PointerDown]: ViewletEditorImageEvents.handlePointerDown,
    [DomEventType.PointerUp]: ViewletEditorImageEvents.handlePointerUp,
    [DomEventType.ContextMenu]: ViewletEditorImageEvents.handleContextMenu,
  })
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletEditorImageEvents.handleWheel, DomEventOptions.Passive)
}

export const setTransform = (state, transform) => {
  const { $ImageWrapper } = state
  $ImageWrapper.style.transform = transform
}

export const setSrc = (state, src) => {
  const { $Image } = state
  $Image.src = src
}

export const setDragging = (state, isDragging) => {
  const { $Viewlet } = state
  $Viewlet.classList.toggle('Dragging', isDragging)
}

export const dispose = (state) => {}

export const setError = (state, message) => {
  const { $Viewlet } = state
  const $Error = document.createElement('div')
  $Error.className = 'ViewletError'
  $Error.textContent = message
  $Viewlet.replaceChildren($Error)
}
