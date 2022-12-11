import { findIndex } from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
}

export const handleClick = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  // TODO ignore when index === -1
  RendererWorker.send(
    /* SourceControl.handleClick */ 'Source Control.handleClick',
    /* index */ index
  )
}

export const handleMouseOver = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  RendererWorker.send(
    /* SourceControl.handleMouseOver */ 'Source Control.handleMouseOver',
    /* index */ index
  )
}

export const handleContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  RendererWorker.send(
    /* SourceControl.handleContextMenu */ 'Source Control.handleContextMenu',
    /* x */ clientX,
    /* y */ clientY
  )
}

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send(
    /* SourceControl.handleContextMenu */ 'Source Control.handleInput',
    /* value */ value
  )
}
