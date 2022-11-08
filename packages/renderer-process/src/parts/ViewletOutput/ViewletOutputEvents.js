import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleChange = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* viewletSend */ 'Viewlet.send',
    /* ViewletId */ 'Output',
    /* method */ 'setOutputChannel',
    /* option */ value
  )
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(
    /* Output.handleScrollBarMove */ 'Output.handleScrollBarMove',
    /* y */ clientY
  )
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener('pointermove', handleScrollBarThumbPointerMove)
  target.removeEventListener('pointerup', handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener('pointermove', handleScrollBarThumbPointerMove, {
    passive: false,
  })
  target.addEventListener('pointerup', handleScrollBarPointerUp)
  RendererWorker.send(
    /* Output.handleScrollBarClick */ 'Output.handleScrollBarClick',
    /* y */ clientY
  )
}
