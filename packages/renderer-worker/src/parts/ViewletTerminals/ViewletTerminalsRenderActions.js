import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletTerminalsActions from './ViewletTerminalsActions.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletTerminalsActions.getActions(newState)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
