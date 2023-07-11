import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletSideBarFunctions from './ViewletSideBarFunctions.js'

const handleClickAction = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletSideBarFunctions.handleClickAction(uid, index)
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  if (target.classList.contains('IconButton')) {
    return handleClickAction(target, uid)
  }
}
