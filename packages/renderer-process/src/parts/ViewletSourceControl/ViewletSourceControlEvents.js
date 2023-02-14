import { findIndex } from '../../shared/findIndex.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as ViewletSourceControlFunctions from './ViewletSourceControlFunctions.js'

export const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
}

const getButtonFunctionName = (title) => {
  switch (title) {
    case 'Add':
      return ViewletSourceControlFunctions.handleClickAdd
    case 'Restore':
      return ViewletSourceControlFunctions.handleClickRestore
    case 'Open File':
      return ViewletSourceControlFunctions.handleClickOpenFile
    default:
      throw new Error(`unsupported button ${title}`)
  }
}

export const handleClick = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  if (index === -1) {
    return
  }
  if (target.className === 'SourceControlButton') {
    const fn = getButtonFunctionName(target.title)
    fn(index)
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
