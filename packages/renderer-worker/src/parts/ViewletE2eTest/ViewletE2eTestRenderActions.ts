import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletE2eTestActions from './ViewletE2eTestActions.ts'
import { E2eTestState } from './ViewletE2eTestTypes.ts'

export const renderActions = {
  isEqual(oldState: E2eTestState, newState: E2eTestState) {
    return oldState.name === newState.name
  },
  apply(oldState: E2eTestState, newState: E2eTestState) {
    const actions = ViewletE2eTestActions.getActions()
    const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
    return dom
  },
}
