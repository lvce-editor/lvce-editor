import * as ClickDetailType from '../ClickDetailType/ClickDetailType.js'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.js'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.js'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.js'

export const handleMouseDown = (state, modifier, x, y, detail) => {
  switch (detail) {
    case ClickDetailType.Single:
      return EditorHandleSingleClick.handleSingleClick(state, modifier, x, y)
    case ClickDetailType.Double:
      return EditorHandleDoubleClick.handleDoubleClick(state, modifier, x, y)
    case ClickDetailType.Triple:
      return EditorHandleTripleClick.handleTripleClick(state, modifier, x, y)
    default:
      return { newState: state, commands: [] }
  }
}
