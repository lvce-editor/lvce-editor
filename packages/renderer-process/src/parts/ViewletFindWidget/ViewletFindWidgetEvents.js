import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Focus from '../Focus/Focus.js'
import * as Event from '../Event/Event.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('FindWidget.handleInput', value)
}

const handleClickClose = (event) => {
  Event.preventDefault(event)
  RendererWorker.send('Viewlet.closeWidget', 'FindWidget')
}

const handleClickPreviousMatch = (event) => {
  Event.preventDefault(event)
  RendererWorker.send('FindWidget.focusPrevious')
}

const handleClickNextMatch = (event) => {
  Event.preventDefault(event)
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

export const handleInputBlur = (event) => {
  Focus.setFocus('')
}

export const handleFocus = (event) => {
  Focus.setFocus('FindWidget')
}
