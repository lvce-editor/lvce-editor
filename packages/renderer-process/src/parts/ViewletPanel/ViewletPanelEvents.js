import * as ViewletPanelFunctions from './ViewletPanelFunctions.js'

export const handleClickClose = (event) => {
  ViewletPanelFunctions.hidePanel()
}

export const handleClickMaximize = (event) => {
  ViewletPanelFunctions.toggleMaximize()
}
