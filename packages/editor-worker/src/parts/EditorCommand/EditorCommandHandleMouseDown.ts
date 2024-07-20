// @ts-ignore
import * as ClickDetailType from '../ClickDetailType/ClickDetailType.ts'
import * as EditorHandleDoubleClick from './EditorCommandHandleDoubleClick.ts'
import * as EditorHandleSingleClick from './EditorCommandHandleSingleClick.ts'
import * as EditorHandleTripleClick from './EditorCommandHandleTripleClick.ts'

export const handleMouseDown = (state: any, modifier: any, x: number, y: number, detail: any) => {
  switch (detail) {
    case ClickDetailType.Single:
      return EditorHandleSingleClick.handleSingleClick(state, modifier, x, y)
    case ClickDetailType.Double:
      return EditorHandleDoubleClick.handleDoubleClick(state, modifier, x, y)
    case ClickDetailType.Triple:
      return EditorHandleTripleClick.handleTripleClick(state, modifier, x, y)
    default:
      return state
  }
}
