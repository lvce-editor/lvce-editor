import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  if ($Target.classList.contains('EditorCompletionItem')) {
    return getNodeIndex($Target)
  }
  return -1
}

export const handleMousedown = (event) => {
  event.preventDefault()
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  RendererWorker.send(
    /* ViewletEditorCompletion.selectIndex */ 'EditorCompletion.selectIndex',
    /* index */ index
  )
}
