import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

export const showMenu = async (state, x, toolbarTop, buttonTop, buttonHeight) => {
  const y = state.y + toolbarTop + buttonTop + buttonHeight
  // Opening a menu can enqueue overlay changes or actions on this same viewlet.
  void ContextMenu.show2Below(state.uid, MenuEntryId.SimpleBrowserToolbar, x, y, state.browserViewId).catch((error) => {
    console.error('[renderer-worker] Failed to open browser menu', error)
  })
  return state
}
