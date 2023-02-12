import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletLayoutFunctions from './ViewletLayoutFunctions.js'

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
  ViewletLayoutFunctions.handleSashPointerMove(clientX, clientY)
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
  ViewletLayoutFunctions.handleSashPointerDown(id)
}

export const handleSashDoubleClick = (event) => {
  const { target } = event
  const id = getSashId(target)
  ViewletLayoutFunctions.handleSashDoubleClick(id)
}

export const handleResize = () => {
  const { innerWidth, innerHeight } = window
  ViewletLayoutFunctions.handleResize(innerWidth, innerHeight)
}
