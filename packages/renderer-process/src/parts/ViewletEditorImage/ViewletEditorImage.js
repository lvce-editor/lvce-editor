import * as ViewletEditorImageEvents from './ViewletEditorImageEvents.js'

export const name = 'EditorImage'

export const create = () => {
  const $Image = document.createElement('img')
  $Image.className = 'ViewletImage'
  $Image.draggable = false

  const $ImageWrapper = document.createElement('div')
  $ImageWrapper.className = 'ImageWrapper'
  $ImageWrapper.append($Image)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorImage'
  $Viewlet.append($ImageWrapper)
  $Viewlet.onpointerdown = ViewletEditorImageEvents.handlePointerDown
  $Viewlet.onpointerup = ViewletEditorImageEvents.handlePointerUp
  $Viewlet.oncontextmenu = ViewletEditorImageEvents.handleContextMenu
  $Viewlet.addEventListener('wheel', ViewletEditorImageEvents.handleWheel, {
    passive: true,
  })
  return {
    $Viewlet,
    $Image,
    $ImageWrapper,
  }
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
