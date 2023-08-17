import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletSashFunctions from './ViewletSashFunctions.js'

const getSashId = ($Target) => {
  console.log($Target.classList)
  if ($Target.classList.contains('SashHorizontal')) {
    return 'Panel'
  }
  if ($Target.classList.contains('SashVertical')) {
    return 'SideBar'
  }
  return ''
}

export const handleSashPointerMove = (event) => {
  const { clientX, clientY } = event
  ViewletSashFunctions.handleSashPointerMove(clientX, clientY)
}

export const handleSashPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.removeEventListener(DomEventType.PointerUp, handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  console.log('down')
  const { target, pointerId } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleSashPointerMove)
  target.addEventListener(DomEventType.PointerUp, handleSashPointerUp)
  const id = getSashId(target)
  ViewletSashFunctions.handleSashPointerDown(id)
}
