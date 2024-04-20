import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletProblemsActions from './ViewletProblemsActions.ts'

export const renderActions = {
  isEqual(oldState, newState) {
    return (
      oldState.viewMode === newState.viewMode &&
      oldState.problems === newState.problems &&
      oldState.filterValue === newState.filterValue &&
      oldState.inputSource === newState.inputSource &&
      oldState.width === newState.width
    )
  },
  apply(oldState, newState) {
    const actions = ViewletProblemsActions.getActions(newState)
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
