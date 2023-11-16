import * as FocusState from '../FocusState/FocusState.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const setFocus = async (focusKey) => {
  FocusState.set(focusKey)
  // TODO send matching keybindings to renderer process?
  await RendererProcess.invoke('Focus.setFocus', focusKey)
}
