import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (value) => {
  RendererWorker.send('FindWidget.handleInput', value)
}

export const close = () => {
  RendererWorker.send('Viewlet.closeWidget', 'FindWidget')
}

export const focusPrevious = () => {
  RendererWorker.send('FindWidget.focusPrevious')
}

export const focusNext = () => {
  RendererWorker.send('FindWidget.focusNext')
}
