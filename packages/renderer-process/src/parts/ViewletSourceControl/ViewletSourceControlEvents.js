import { findIndex } from '../../shared/findIndex.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleFocus = () => {
  Focus.setFocus('sourceControlInput')
}

const getButtonFunctionName = (title) => {
  switch (title) {
    case 'Add':
      return `Source Control.handleClickAdd`
    case 'Restore':
      return `Source Control.handleClickRestore`
    case 'Open File':
      return 'Source Control.handleClickOpenFile'
    default:
      throw new Error(`unsupported button ${title}`)
  }
}

export const handleClick = (event) => {
  const { target } = event
  const $Parent = target.closest('.SourceControlItems')
  const index = findIndex($Parent, target)
  if (index === -1) {
    return
  }
  if (target.className === 'SourceControlButton') {
    const fnName = getButtonFunctionName(target.title)
    RendererWorker.send(
      /* SourceControl.handleClick */ fnName,
      /* index */ index
    )
    return
  }
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
