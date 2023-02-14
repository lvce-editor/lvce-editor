import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletSearchHandleContextMenuKeyBoard from './ViewletSearchHandleContextMenuKeyBoard.js'
import * as ViewletSearchHandleContextMenuMouseAt from './ViewletSearchHandleContextMenuMouseAt.js'

export const handleContextMenu = (state, button, x, y) => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletSearchHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)
    default:
      return ViewletSearchHandleContextMenuMouseAt.handleContextMenuMouseAt(state, x, y)
  }
}
