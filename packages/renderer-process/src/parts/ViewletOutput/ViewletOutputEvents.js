import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleChange = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* viewletSend */ 'Viewlet.send',
    /* ViewletId */ 'Output',
    /* method */ 'setOutputChannel',
    /* option */ value
  )
}
