import { findIndex } from '../../shared/findIndex.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletSourceControlFunctions from './ViewletSourceControlFunctions.js'

export const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
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
  if (target.className === 'SourceControlButton') {
    const index = getButtonIndex(target)
    ViewletSourceControlFunctions.handleButtonClick(index)
    return
  }
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  if (index === -1) {
    return
  }
  ViewletSourceControlFunctions.handleClick(index)
}

export const handleMouseOver = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  ViewletSourceControlFunctions.handleMouseOver(index)
}

export const handleMouseOut = (event) => {
  const { target, relatedTarget } = event
  const $Parent = relatedTarget.closest('.SourceControlItems')
  if (!$Parent) {
    ViewletSourceControlFunctions.handleMouseOut(-1)
    return
  }
  const index = findIndex($Parent, target)
  ViewletSourceControlFunctions.handleMouseOut(index)
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  ViewletSourceControlFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSourceControlFunctions.handleInput(value)
}
