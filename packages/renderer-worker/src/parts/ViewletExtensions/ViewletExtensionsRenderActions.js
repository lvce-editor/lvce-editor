import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletExtensionsActions from './ViewletExtensionsActions.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletExtensionsActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
