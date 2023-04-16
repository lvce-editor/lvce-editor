import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as ViewletPanelFunctions from './ViewletPanelFunctions.js'

export const handleClickClose = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.hidePanel(uid)
}

export const handleClickMaximize = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.toggleMaximize(uid)
}
