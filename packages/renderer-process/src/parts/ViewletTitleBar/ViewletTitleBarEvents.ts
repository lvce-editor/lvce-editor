import * as Event from '../Event/Event.ts'

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  return ['handleContextMenu', button, clientX, clientY]
}

export const returnValue = true
