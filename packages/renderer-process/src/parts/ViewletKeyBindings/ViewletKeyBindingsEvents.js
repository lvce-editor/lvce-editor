import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send('KeyBindings.handleInput', value)
}
