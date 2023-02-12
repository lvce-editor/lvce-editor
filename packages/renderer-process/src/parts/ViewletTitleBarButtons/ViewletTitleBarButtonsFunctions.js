import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleClickMinmize = () => {
  RendererWorker.send('TitleBarButtons.handleClickMinimize')
}

export const handleClickToggleMaximize = () => {
  RendererWorker.send('TitleBarButtons.handleClickToggleMaximize')
}

export const handleClickClose = () => {
  RendererWorker.send('TitleBarButtons.handleClickClose')
}
