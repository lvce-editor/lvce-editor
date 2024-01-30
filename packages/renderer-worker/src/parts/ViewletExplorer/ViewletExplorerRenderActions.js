import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletExplorerActions from './ViewletExplorerActions.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletExplorerActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom()
    return dom
  },
}
