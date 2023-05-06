import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ViewletPanelFunctions from './ViewletPanelFunctions.js'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

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
  switch ($Target.className) {
    case 'PanelTab': {
      const index = GetNodeIndex.getNodeIndex($Target)
      RendererWorker.send(/* Panel.selectIndex */ 'Panel.selectIndex', /* index */ index)
      break
    }
    default:
      break
  }
}
