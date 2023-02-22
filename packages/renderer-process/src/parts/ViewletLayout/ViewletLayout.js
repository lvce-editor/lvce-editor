import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as ViewletLayoutEvents from './ViewletLayoutEvents.js'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashSideBar = document.createElement('div')
  $SashSideBar.className = 'Viewlet SashVertical'
  $SashSideBar.id = 'SashSideBar'

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashPanel = document.createElement('div')
  $SashPanel.className = 'Viewlet SashHorizontal'
  $SashPanel.id = 'SashPanel'

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Workbench'
  $Viewlet.className = 'Viewlet Layout'
  // @ts-ignore
  $Viewlet.role = AriaRoles.Application
  $Viewlet.append($SashSideBar, $SashPanel)

  return {
    $Viewlet,
    $SashSideBar,
    $SashPanel,
  }
}

export const attachEvents = (state) => {
  const { $SashSideBar, $SashPanel } = state
  $SashSideBar.onpointerdown = ViewletLayoutEvents.handleSashPointerDown
  $SashSideBar.ondblclick = ViewletLayoutEvents.handleSashDoubleClick

  $SashPanel.onpointerdown = ViewletLayoutEvents.handleSashPointerDown
  $SashPanel.ondblclick = ViewletLayoutEvents.handleSashDoubleClick

  window.addEventListener(DomEventType.Resize, ViewletLayoutEvents.handleResize)
}

export const setSashes = (state, sashSideBar, sashPanel) => {
  const { $SashSideBar, $SashPanel } = state
  SetBounds.setBounds($SashSideBar, sashSideBar.x, sashSideBar.y, sashSideBar.width, sashSideBar.height)
  SetBounds.setBounds($SashPanel, sashPanel.x, sashPanel.y, sashPanel.width, sashPanel.height)
}
