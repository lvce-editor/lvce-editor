import * as OffscreenCanvsa from '../OffscreenCanvas/OffscreenCanvas.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Pdf'
  $Viewlet.textContent = 'pdf'
  return {
    $Viewlet,
  }
}

export const setCanvas = (state, id) => {
  const { $Viewlet } = state
  const $Canvas = OffscreenCanvsa.get(id)
  $Viewlet.replaceChildren($Canvas)
}
