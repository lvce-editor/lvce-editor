import * as RendererWorker from './QuickPickIpc.js'

export const handleBeforeInput = (event) => {
  event.preventDefault()
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  RendererWorker.send(
    /* method */ 'handleBeforeInput',
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

export const handleMouseDown = (event) => {
  event.preventDefault()
  const { clientX, clientY, target } = event
  const index = getNodeIndex(target.parentNode)
  RendererWorker.send(/* selectIndex */ 'selectIndex', /* index */ index)
}
