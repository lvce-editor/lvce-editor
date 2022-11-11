import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Focus from '../Focus/Focus.js'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  RendererWorker.send('SimpleBrowser.handleInput', value)
}

export const handleFocus = (event) => {
  const { target } = event
  Focus.setFocus('SimpleBrowserInput')
  setTimeout(() => {
    target.select()
  })
}

export const handleBlur = (event) => {
  const { target } = event
  target.setSelectionRange(0, 0)
}

export const handleClickForward = () => {
  RendererWorker.send('SimpleBrowser.forward')
}

export const handleClickBackward = () => {
  RendererWorker.send('SimpleBrowser.backward')
}

export const handleClickReload = () => {
  RendererWorker.send('SimpleBrowser.reload')
}

export const handleClickOpenExternal = () => {
  RendererWorker.send('SimpleBrowser.openExternal')
}
