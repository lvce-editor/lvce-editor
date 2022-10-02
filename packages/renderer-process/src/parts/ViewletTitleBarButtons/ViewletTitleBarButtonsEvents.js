import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleClickMinmize = () => {
  RendererWorker.send('TitleBarButtons.handleClickMinimize')
}

const handleClickToggleMaximize = () => {
  RendererWorker.send('TitleBarButtons.handleClickToggleMaximize')
}

const handleClickClose = () => {
  RendererWorker.send('TitleBarButtons.handleClickClose')
}

/**
 *
 * @param {MouseEvent} event
 */
export const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  // @ts-ignore
  const { id } = target
  switch (id) {
    case 'TitleBarButtonMinimize':
      handleClickMinmize()
      break
    case 'TitleBarButtonToggleMaximize':
      handleClickToggleMaximize()
      break
    case 'TitleBarButtonClose':
      handleClickClose()
      break
    default:
      break
  }
}
