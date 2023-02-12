import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (value) => {
  RendererWorker.send('KeyBindings.handleInput', value)
}

export const handleClick = (index) => {
  RendererWorker.send('KeyBindings.handleClick', index)
}

export const handleWheel = (deltaY) => {
  RendererWorker.send('KeyBindings.handleWheel', deltaY)
}

export const handleResizerMove = (x) => {
  RendererWorker.send('KeyBindings.handleResizerMove', x)
}

export const handlResizerClick = (id, x) => {
  RendererWorker.send('KeyBindings.handleResizerClick', id, x)
}
