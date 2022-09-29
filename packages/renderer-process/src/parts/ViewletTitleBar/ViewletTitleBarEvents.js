import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const handleTitleBarButtonClickMinmize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickMinimize')
}

const handleTitleBarButtonClickToggleMaximize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickToggleMaximize')
}

const handleTitleBarButtonClickClose = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickClose')
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
      handleTitleBarButtonClickMinmize()
      break
    case 'TitleBarButtonToggleMaximize':
      handleTitleBarButtonClickToggleMaximize()
      break
    case 'TitleBarButtonClose':
      handleTitleBarButtonClickClose()
      break
    default:
      break
  }
}
