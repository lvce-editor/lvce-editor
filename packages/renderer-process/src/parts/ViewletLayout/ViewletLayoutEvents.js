import * as KeyBindingsEvents from '../KeyBindingsEvents/KeyBindingsEvents.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.js'
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
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleSashPointerMove, handlePointerCaptureLost)
  const id = getSashId(target)
  ViewletLayoutFunctions.handleSashPointerUp(id)
}

export const handleSashPointerDown = (event) => {
  const { target, pointerId } = event
  PointerEvents.startTracking(target, pointerId, handleSashPointerMove, handlePointerCaptureLost)
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

export const handleFocus = () => {
  ViewletLayoutFunctions.handleFocus()
}

export const handleBlur = () => {
  ViewletLayoutFunctions.handleBlur()
}

export const handleKeyDown = KeyBindingsEvents.handleKeyDown

export const handleKeyUp = KeyBindingsEvents.handleKeyUp
