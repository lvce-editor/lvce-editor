import * as RendererWorker from './QuickPickIpc.js'
import * as KeyBindings from './QuickPickKeyBindings.js'

export const handleBeforeInput = (event) => {
  event.preventDefault()
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  RendererWorker.send(
    /* method */ 'QuickPick.handleBeforeInput',
    /* inputType */ inputType,
    /* data */ data,
    /* selectionStart */ selectionStart,
    /* selectionEnd */ selectionEnd
  )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getItem = ($Target) => {
  switch ($Target.className) {
    case 'QuickPickItem':
      return $Target
    default:
      return $Target.parentNode
  }
}

export const handleMouseDown = (event) => {
  event.preventDefault()
  const { target } = event
  const $Item = getItem(target)
  const index = getNodeIndex($Item)
  console.log({ $Item, index })
  RendererWorker.send(
    /* selectIndex */ 'QuickPick.selectIndex',
    /* index */ index
  )
}

const getIdentifier = (event) => {
  let identifier = ''
  if (event.ctrlKey) {
    identifier += 'ctrl+'
  }
  if (event.shiftKey) {
    identifier += 'shift+'
  }
  if (event.altKey) {
    identifier += 'alt+'
  }
  let key = event.key
  if (key === ' ') {
    key = 'Space'
  }
  if (key.length === 1) {
    key = key.toLowerCase()
  }
  identifier += key
  return identifier
}

const matchesIdentifier = (keyBinding, identifier) => {
  return keyBinding.key === identifier
}

const getMatchingKeyBinding = (keyBindings, identifier) => {
  for (const keyBinding of keyBindings) {
    if (matchesIdentifier(keyBinding, identifier)) {
      return keyBinding
    }
  }
  return undefined
}

export const handleKeyDown = (event) => {
  const keyBindings = KeyBindings.getKeyBindings()
  const identifier = getIdentifier(event)
  const matchingKeyBinding = getMatchingKeyBinding(keyBindings, identifier)
  if (!matchingKeyBinding) {
    return
  }
  event.preventDefault()
  const { command } = matchingKeyBinding
  RendererWorker.send(command)
}
