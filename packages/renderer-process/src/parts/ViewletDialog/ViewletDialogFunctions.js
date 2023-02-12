import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleClick = (index) => {
  RendererWorker.send(/* Dialog.handleClick */ 'Dialog.handleClick', /* index */ index)
}
