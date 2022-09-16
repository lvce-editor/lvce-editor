import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handlePointerMove = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send('EditorImage.handlePointerMove', clientX, clientY)
}

export const handlePointerUp = (event) => {
  const { target } = event
  const $Viewlet = target.closest('.Viewlet')
  $Viewlet.removeEventListener('pointermove', handlePointerMove, {
    passive: true,
  })
}

export const handlePointerDown = (event) => {
  const { clientX, clientY, target } = event
  const $Viewlet = target.closest('.Viewlet')
  $Viewlet.addEventListener('pointermove', handlePointerMove, { passive: true })
  RendererWorker.send('EditorImage.handlePointerDown', clientX, clientY)
}
