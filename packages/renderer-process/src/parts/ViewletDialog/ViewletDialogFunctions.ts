import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleClick = (index) => {
  RendererWorker.send(/* Dialog.handleClick */ 'Dialog.handleClick', /* index */ index)
}
