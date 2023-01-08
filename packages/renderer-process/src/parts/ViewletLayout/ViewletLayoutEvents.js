import * as DomEventType from '../DomEventType/DomEventType.js'
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
  RendererWorker.send(/* Layout.handleSashPointerMove */ 'Layout.handleSashPointerMove', /* x */ clientX, /* y */ clientY)
}

export const handlePointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.removeEventListener(DomEventType.LostPointerCapture, handlePointerCaptureLost)
}

export const handleSashPointerDown = (event) => {
  const { target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.addEventListener(DomEventType.LostPointerCapture, handlePointerCaptureLost)
  const id = getSashId(target)
  RendererWorker.send(/* Layout.handleSashPointerDown */ 'Layout.handleSashPointerDown', /* id */ id)
}

export const handleSashDoubleClick = (event) => {
  const { target } = event
  const id = getSashId(target)
  RendererWorker.send(/* Layout.handleSashDoubleClick */ 'Layout.handleSashDoubleClick', /* id */ id)
}

export const handleResize = () => {
  const { innerWidth, innerHeight } = window
  RendererWorker.send(/* Layout.handleResize */ 'Layout.handleResize', /* width */ innerWidth, /* height */ innerHeight)
}
