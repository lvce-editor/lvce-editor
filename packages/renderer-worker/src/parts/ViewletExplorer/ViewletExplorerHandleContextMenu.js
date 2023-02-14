import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletExplorerHandleContextMenuKeyBoard from './ViewletExplorerHandleContextMenuKeyboard.js'
import * as ViewletExplorerHandleContextMenuMouseAt from './ViewletExplorerHandleContextMenuMouseAt.js'

export const handleContextMenu = (state, button, x, y) => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletExplorerHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)
    default:
      return ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt(state, x, y)
  }
}
