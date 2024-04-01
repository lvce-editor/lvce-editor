import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ViewletSashFunctions from './ViewletSashFunctions.ts'

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
  ViewletSashFunctions.handleSashPointerMove(clientX, clientY)
}

export const handleSashPointerUp = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  const { target, pointerId } = event
  PointerEvents.startTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)
  const id = getSashId(target)
  ViewletSashFunctions.handleSashPointerDown(id)
}
