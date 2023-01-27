import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

export const handleClick = (event) => {
  const { target } = event
  const index = getNodeIndex(target)
  RendererWorker.send(/* Dialog.handleClick */ 'Dialog.handleClick', /* index */ index)
}
