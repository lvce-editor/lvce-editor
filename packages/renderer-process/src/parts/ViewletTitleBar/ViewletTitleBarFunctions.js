import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleTitleBarButtonClickMinmize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickMinimize')
}

export const handleTitleBarButtonClickToggleMaximize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickToggleMaximize')
}

export const handleTitleBarButtonClickClose = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickClose')
}
