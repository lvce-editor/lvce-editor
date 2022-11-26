import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (input) => {
  RendererWorker.send(
    /* viewletSend */ 'Viewlet.send',
    /* viewletId */ 'Terminal',
    /* method */ 'write',
    /* input */ input
  )
}

export const handleFocus = () => {
  Focus.setFocus('terminal')
}
