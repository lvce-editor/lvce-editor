import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'

export const renderActions = {
  isEqual(oldState, newState) {
    return oldState === newState
  },
  apply(oldState, newState) {
    const actions = []
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
