import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletProblemsActions from './ViewletProblemsActions.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState.viewMode === newState.viewMode
  },
  apply(oldState, newState) {
    const actions = ViewletProblemsActions.getActions(newState)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
