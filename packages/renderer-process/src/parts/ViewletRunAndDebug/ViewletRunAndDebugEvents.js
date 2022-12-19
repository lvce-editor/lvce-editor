import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleClickContinue = () => {
  RendererWorker.send('Run And Debug.continue')
}

const handleClickPause = (event) => {
  RendererWorker.send('Run And Debug.pause')
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
    default:
      break
  }
}
