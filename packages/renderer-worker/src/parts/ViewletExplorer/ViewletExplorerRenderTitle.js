import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.js'
import * as ViewletExplorerActions from './ViewletExplorerActions.ts'

export const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.root === newState.root
  },
  apply(oldState, newState) {
    const title = 'Explorer: test'
    return title
  },
}
