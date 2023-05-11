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

export const panelTabsHandleClick = (event) => {
  const $Target = event.target
  const uid = ComponentUid.fromEvent(event)
  switch ($Target.className) {
    case 'PanelTab':
      const index = GetNodeIndex.getNodeIndex($Target)
      ViewletPanelFunctions.selectIndex(uid, index)
      break
    default:
      break
  }
}
