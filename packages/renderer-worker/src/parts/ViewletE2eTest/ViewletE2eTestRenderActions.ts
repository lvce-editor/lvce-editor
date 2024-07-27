import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletE2eTestsActions from './ViewletE2eTestsActions.ts'
import { E2eState } from './ViewletE2eTestsTypes.ts'

export const renderActions = {
  isEqual(oldState: E2eState, newState: E2eState) {
    return oldState.tests === newState.tests
  },
  apply(oldState: E2eState, newState: E2eState) {
    const actions = ViewletE2eTestsActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
