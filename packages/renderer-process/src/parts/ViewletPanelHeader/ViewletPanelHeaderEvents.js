import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

export const handleClickTab = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'PanelTab': {
      const index = getNodeIndex($Target)
      RendererWorker.send(
        /* Panel.selectIndex */ 'Panel.selectIndex',
        /* index */ index
      )
      break
    }
    default:
      break
  }
}

export const handleClickClose = (event) => {
  RendererWorker.send('Layout.hidePanel')
}
