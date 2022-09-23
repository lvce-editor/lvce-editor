import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('EditorFindWidget.handleInput', value)
}

const handleClickClose = (event) => {
  event.preventDefault()
  RendererWorker.send('Viewlet.closeWidget', 'EditorFindWidget')
}

const handleClickPreviousMatch = (event) => {
  event.preventDefault()
  RendererWorker.send('EditorFindWidget.focusPrevious')
}

const handleClickNextMatch = (event) => {
  event.preventDefault()
  RendererWorker.send('EditorFindWidget.focusNext')
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
