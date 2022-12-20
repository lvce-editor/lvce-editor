import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleClickContinue = () => {
  RendererWorker.send('Run And Debug.continue')
}

const handleClickPause = (event) => {
  RendererWorker.send('Run And Debug.pause')
}

const handleClickPauseContinue = (event, target) => {
  event.preventDefault()
  if (target.textContent === 'pause') {
    RendererWorker.send('Run And Debug.pause')
  } else if (target.textContent === 'continue') {
    RendererWorker.send('Run And Debug.continue')
  }
}

export const handleMouseDown = (event) => {
  const { target } = event
  switch (target.className) {
    case 'DebugButtonContinue':
      handleClickContinue()
      break
    case 'DebugButtonPause':
      handleClickPause()
      break
    case 'DebugButtonPauseContinue':
      handleClickPauseContinue(event, target)
      break
    default:
      break
  }
}
