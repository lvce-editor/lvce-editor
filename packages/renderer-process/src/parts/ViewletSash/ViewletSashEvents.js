import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as DomEventType from '../DomEventType/DomEventType.js'

// export const handleResize = (event) => {
//   RendererWorker.send(
//     /* Layout.handleResize */ 'Layout.handleResize',
//     /* bounds */ getBounds()
//   )
// }

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
  target.removeEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.removeEventListener(DomEventType.PointerUp, handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  const { target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.addEventListener(DomEventType.PointerUp, handleSashPointerUp)
  const $Target = event.target
  const id = getSashId($Target)
  RendererWorker.send(
    /* Layout.handleSashPointerDown */ 'Layout.handleSashPointerDown',
    /* id */ id
  )
}
