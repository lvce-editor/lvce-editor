import * as Event from '../Event/Event.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'

const get$ItemFromEvent = (event) => {
  const $Target = event.target
  if ($Target.classList.contains('ActivityBarItem')) {
    return $Target
  }
  if ($Target.classList.contains('ActivityBarItemIcon')) {
    return $Target.parentNode
  }
  return undefined
}

export const handleMouseDown = (event) => {
  const { button, clientX, clientY } = event
  const $Item = get$ItemFromEvent(event)
  if (!$Item) {
    return []
  }
  Event.preventDefault(event)
  Event.stopPropagation(event)
  const index = GetNodeIndex.getNodeIndex($Item)
  return ['handleClick', button, index, clientX, clientY]
}

export const handleBlur = () => {
  return ['handleBlur']
}

export const handleFocus = () => {
  return ['handleFocus']
}

// TODO use context menu events function again

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  return ['handleContextMenu', button, clientX, clientY]
}

export const returnValue = true
