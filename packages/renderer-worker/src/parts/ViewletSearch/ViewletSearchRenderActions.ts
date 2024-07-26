import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletSearchActions from './ViewletSearchActions.ts'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletSearchActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
