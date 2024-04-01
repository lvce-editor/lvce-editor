import { findIndex } from '../../shared/findIndex.js'
import * as ComponentUid from '../ComponentUid/componentuid.ts'
import * as ViewletSourceControlFunctions from './ViewletSourceControlFunctions.js'

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletSourceControlFunctions.handleFocus(uid)
}

const getButtonIndex = ($Node) => {
  let index = -1
  while ($Node) {
    if ($Node.className !== 'SourceControlButton') {
      break
    }
    $Node = $Node.previousElementSibling
    index++
  }
  return index
}

export const handleClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  if (target.className === 'SourceControlButton') {
    const index = getButtonIndex(target)
    ViewletSourceControlFunctions.handleButtonClick(uid, index)
    return
  }
  const $Parent = target.closest('.SourceControlItems')
  if (!$Parent) {
    return
  }
  const index = findIndex($Parent, target)
  if (index === -1) {
    return
  }
  ViewletSourceControlFunctions.handleClick(uid, index)
}

export const handleMouseOver = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  if (!$Parent) {
    return
  }
  const index = findIndex($Parent, target)
  const uid = ComponentUid.fromEvent(event)
  ViewletSourceControlFunctions.handleMouseOver(uid, index)
}

export const handleMouseOut = (event) => {
  const { target, relatedTarget } = event
  if (!relatedTarget) {
    return
  }
  const $Parent = relatedTarget.closest('.SourceControlItems')
  const uid = ComponentUid.fromEvent(event)
  if (!$Parent) {
    ViewletSourceControlFunctions.handleMouseOut(uid, -1)
    return
  }
  const index = findIndex($Parent, target)
  ViewletSourceControlFunctions.handleMouseOut(uid, index)
}

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletSourceControlFunctions.handleInput(uid, value)
}

export * from '../ContextMenuEvents/ContextMenuEvents.js'
export * from '../VirtualListEvents/VirtualListEvents.js'
