import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const closeEditor = (index) => {
  RendererWorker.send('Main.closeEditor', index)
}

export const handleTabClick = (index) => {
  RendererWorker.send('Main.handleTabClick', index)
}

export const handleTabContextMenu = (index, x, y) => {
  RendererWorker.send('Main.handleTabContextMenu', index, x, y)
}
