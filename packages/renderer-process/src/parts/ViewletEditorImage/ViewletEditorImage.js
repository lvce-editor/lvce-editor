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
  // TODO maybe set pointer move handle once pointer down is called
  // but that would require keeping track of how many pointers are down
  // and removing the listener when pointerDownCount === 0
  // TODO not sure whether this event listener should be passive or not
  // doesn't seem to make a difference
  $Viewlet.addEventListener(
    'pointermove',
    ViewletEditorImageEvents.handlePointerMove,
    { passive: true }
  )
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
