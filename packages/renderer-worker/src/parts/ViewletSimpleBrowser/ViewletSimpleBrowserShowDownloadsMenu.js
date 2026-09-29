import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const showDownloadsMenu = async (state, x, toolbarTop, buttonTop, buttonHeight) => {
  const y = state.y + toolbarTop + buttonTop + buttonHeight
  void ContextMenu.show2Below(state.uid, MenuEntryId.SimpleBrowserDownloads, x, y, state.browserViewId).catch((error) => {
    console.error('[renderer-worker] Failed to open downloads menu', error)
  })
  return state
}
