import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleWheel = (deltaY) => {
  RendererWorker.send('QuickPick.handleWheel', deltaY)
}

export const handleClickAt = (x, y) => {
  RendererWorker.send('QuickPick.handleClickAt', x, y)
}

export const handleInput = (value) => {
  RendererWorker.send('QuickPick.handleInput', value)
}

export const handleBlur = () => {
  RendererWorker.send('QuickPick.handleBlur')
}

export const handleBeforeInput = (inputType, data, selectionStart, selectionEnd) => {
  RendererWorker.send('QuickPick.handleBeforeInput', inputType, data, selectionStart, selectionEnd)
}
