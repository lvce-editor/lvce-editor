import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletExplorerActions from './ViewletExplorerActions.ts'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState.root === newState.root
  },
  apply(oldState, newState) {
    const actions = ViewletExplorerActions.getActions(newState.root)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
