import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ViewletTerminalFunctions from './ViewletTerminalFunctions.js'

export const handleInput = (input) => {
  ViewletTerminalFunctions.handleInput(input)
}

export const handleFocus = () => {
  RendererWorker.send('Focus.setFocus', 'terminal')
}
