import { findIndex } from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
}

export const handleClick = (event) => {
  const $Target = event.target
  const $Parent = $Target.closest('.SourceControlItems')
  const index = findIndex($Parent, $Target)
  // TODO ignore when index === -1
  RendererWorker.send(
    /* viewletCommand */ 'Viewlet.send',
    /* viewletId */ 'Source Control',
    /* type */ 'handleClick',
    /* index */ index
  )
}
