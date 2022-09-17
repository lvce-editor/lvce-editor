import * as ViewletEditorImageEvents from './ViewletEditorImageEvents.js'

export const name = 'EditorImage'

export const create = () => {
  const $Image = document.createElement('img')
  $Image.className = 'ViewletImage'
  $Image.draggable = false

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'EditorImage'
  $Viewlet.append($Image)
  $Viewlet.onpointerdown = ViewletEditorImageEvents.handlePointerDown
  $Viewlet.addEventListener('wheel', ViewletEditorImageEvents.handleWheel, {
    passive: true,
  })
  return {
    $Viewlet,
    $Image,
  }
}

export const setTransform = (state, transform) => {
  const { $Image } = state
  $Image.style.transform = transform
}

export const setSrc = (state, src) => {
  const { $Image } = state
  $Image.src = src
}

export const dispose = (state) => {
  window.removeEventListener(
    'pointerup',
    ViewletEditorImageEvents.handlePointerUp
  )
  window.removeEventListener(
    'pointermove',
    ViewletEditorImageEvents.handlePointerMove
  )
}
