import * as Event from '../Event/Event.ts'

export const handlePointerDown = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  return ['handleClickAt', clientX, clientY]
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  return ['handleContextMenu', clientX, clientY]
}

export const handleFilterInput = (event) => {
  const { target } = event
  const { value } = target
  return ['handleFilterInput', value]
}

export const handleClearFilterClick = (event) => {
  return ['clearFilter']
}

export const returnValue = true
