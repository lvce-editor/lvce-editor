import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getInitData = async () => {
  const rendererProcessInitData = await RendererProcess.invoke(
    'InitData.getInitData'
  )
  // TODO get the following items
  // - location.href
  // - workspace
  // - color theme
  // - preferences
  // - restoredState
  // - layout bounds
  // - keybindings
  // - icon theme
  // - languages
  return rendererProcessInitData
}
