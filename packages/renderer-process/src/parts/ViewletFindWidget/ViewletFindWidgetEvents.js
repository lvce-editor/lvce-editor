import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('FindWidget.handleInput', value)
}

const handleClickClose = (event) => {
  event.preventDefault()
  RendererWorker.send('Viewlet.closeWidget', 'FindWidget')
}

const handleClickPreviousMatch = (event) => {
  event.preventDefault()
  RendererWorker.send('FindWidget.focusPrevious')
}

const handleClickNextMatch = (event) => {
  event.preventDefault()
  RendererWorker.send('FindWidget.focusNext')
}

export const handleClick = (event) => {
  const { target } = event
  const { title } = target
  switch (title) {
    case 'Close':
      handleClickClose(event)
      break
    case 'Previous Match':
      handleClickPreviousMatch(event)
      break
    case 'Next Match':
      handleClickNextMatch(event)
      break
    default:
      break
  }
}
