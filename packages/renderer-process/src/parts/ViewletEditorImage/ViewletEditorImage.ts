import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletEditorImageEvents from './ViewletEditorImageEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorImage'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  AttachEvents.attachEvents($Viewlet, {
    [DomEventType.PointerDown]: ViewletEditorImageEvents.handlePointerDown,
    [DomEventType.PointerUp]: ViewletEditorImageEvents.handlePointerUp,
    [DomEventType.ContextMenu]: ViewletEditorImageEvents.handleContextMenu,
    [DomEventType.FocusIn]: ViewletEditorImageEvents.handleFocus,
  })
  $Viewlet.addEventListener(DomEventType.Error, ViewletEditorImageEvents.handleError, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.Wheel, ViewletEditorImageEvents.handleWheel, DomEventOptions.Passive)
}

export const setTransform = (state, transform) => {
  const { $Viewlet } = state
  const $ImageWrapper = $Viewlet.querySelector('.ImageContent')
  $ImageWrapper.style.transform = transform
}

export const setDragging = (state, isDragging) => {
  const { $Viewlet } = state
  $Viewlet.classList.toggle('Dragging', isDragging)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}
