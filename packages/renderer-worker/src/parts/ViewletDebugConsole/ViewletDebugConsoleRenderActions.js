import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletDebugConsoleActions from './ViewletDebugConsoleActions.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletDebugConsoleActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
