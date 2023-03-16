import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const closeMenu = () => {
  RendererWorker.send('TitleBarMenuBar.closeMenu', false)
}

export const handlePointerOver = (index) => {
  RendererWorker.send('TitleBarMenuBar.handleMouseOver', index)
}

export const handleMouseOut = (index) => {
  RendererWorker.send('TitleBarMenuBar.handleMouseOut', index)
}

export const handleClick = (button, index) => {
  RendererWorker.send('TitleBarMenuBar.handleClick', button, index)
}

export const handleMouseOver = (index) => {
  RendererWorker.send('TitleBarMenuBar.handleMouseOver', index)
}

export const handleMenuMouseOver = (level, index) => {
  RendererWorker.send('TitleBarMenuBar.handleMenuMouseOver', level, index)
}

export const handleMenuMouseDown = (level, index) => {
  RendererWorker.send('TitleBarMenuBar.handleMenuMouseDown', level, index)
}
