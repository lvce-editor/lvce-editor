import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('ViewletEditorFindWidget.handleInput', value)
}
