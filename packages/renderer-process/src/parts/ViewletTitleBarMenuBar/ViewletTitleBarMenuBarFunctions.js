import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const closeMenu = () => {
  RendererWorker.send(/* TitleBarMenuBar.closeMenu */ 'TitleBarMenuBar.closeMenu', /* keepFocus */ false)
}

export const handlePointerOver = (index) => {
  RendererWorker.send(/* TitleBarMenuBar.focusIndex */ 'TitleBarMenuBar.handleMouseOver', /* index */ index)
}

export const handleMouseOut = (index) => {
  RendererWorker.send(/* TitleBarMenuBar.handleMouseOut */ 'TitleBarMenuBar.handleMouseOut', /* index */ index)
}

export const handleClick = (button, index) => {
  RendererWorker.send('TitleBarMenuBar.handleClick', button, index)
}

export const handleMenuMouseOver = (level, index) => {
  RendererWorker.send(/* TitleBarMenuBar.handleMenuMouseOver */ 'TitleBarMenuBar.handleMenuMouseOver', /* level */ level, /* index */ index)
}

export const handleMenuMouseDown = (level, index) => {
  RendererWorker.send(/* TitleBarMenuBar.handleMenuMouseDown */ 'TitleBarMenuBar.handleMenuMouseDown', /* level */ level, /* index */ index)
}
