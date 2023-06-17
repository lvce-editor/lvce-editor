import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as ViewletPanelFunctions from './ViewletPanelFunctions.js'

export const handleClickClose = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.hidePanel(uid)
}

export const handleClickMaximize = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.toggleMaximize(uid)
}

const handleClickTab = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletPanelFunctions.selectIndex(uid, index)
}

const handleClickAction = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletPanelFunctions.handleClickAction(uid, index)
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  if (target.classList.contains('PanelTab')) {
    return handleClickTab(target, uid)
  }
  if (target.classList.contains('IconButton')) {
    return handleClickAction(target, uid)
  }
}
