import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletSearchHandleContextMenuKeyBoard from './ViewletSearchHandleContextMenuKeyBoard.ts'
import * as ViewletSearchHandleContextMenuMouseAt from './ViewletSearchHandleContextMenuMouseAt.ts'

export const handleContextMenu = (state, button, x, y) => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletSearchHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)
    default:
      return ViewletSearchHandleContextMenuMouseAt.handleContextMenuMouseAt(state, x, y)
  }
}
