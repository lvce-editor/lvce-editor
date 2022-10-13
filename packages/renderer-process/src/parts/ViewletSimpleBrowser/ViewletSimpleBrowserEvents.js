import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Focus from '../Focus/Focus.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('SimpleBrowser.handleInput', value)
}

export const handleClick = () => {}

export const handleFocus = () => {
  Focus.setFocus('SimpleBrowserInput')
}
