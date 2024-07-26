import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletOutputActions from './ViewletOutputActions.ts'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = ViewletOutputActions.getActions(newState)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
