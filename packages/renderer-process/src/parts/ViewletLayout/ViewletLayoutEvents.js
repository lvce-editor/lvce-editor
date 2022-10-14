import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getSashId = ($Target) => {
  if ($Target.id === 'SashPanel') {
    return 'Panel'
  }
  if ($Target.id === 'SashSideBar') {
    return 'SideBar'
  }
  return ''
}

export const handleSashPointerMove = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send(
    /* Layout.handleSashPointerMove */ 'Layout.handleSashPointerMove',
    /* x */ clientX,
    /* y */ clientY
  )
}

export const handleSashPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener('pointermove', handleSashPointerMove)
  target.removeEventListener('pointerup', handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  const { target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener('pointermove', handleSashPointerMove)
  target.addEventListener('pointerup', handleSashPointerUp)
  const $Target = event.target
  const id = getSashId($Target)
  RendererWorker.send(
    /* Layout.handleSashPointerDown */ 'Layout.handleSashPointerDown',
    /* id */ id
  )
}

export const handleResize = () => {
  const { innerWidth, innerHeight } = window
  RendererWorker.send(
    /* Layout.handleResize */ 'Layout.handleResize',
    /* width */ innerWidth,
    /* height */ innerHeight
  )
}
