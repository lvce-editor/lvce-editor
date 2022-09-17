import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handlePointerMove = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send('EditorImage.handlePointerMove', clientX, clientY)
}

export const handlePointerUp = (event) => {
  window.removeEventListener('pointermove', handlePointerMove, {
    // @ts-ignore
    passive: true,
  })
  window.removeEventListener('pointerup', handlePointerUp)
}

export const handlePointerDown = (event) => {
  const { clientX, clientY } = event
  // TODO dispose window event listener when widget is removed
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerup', handlePointerUp)
  RendererWorker.send('EditorImage.handlePointerDown', clientX, clientY)
}
