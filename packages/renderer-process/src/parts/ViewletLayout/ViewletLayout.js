import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as ViewletLayoutEvents from './ViewletLayoutEvents.js'
import * as SetBounds from '../SetBounds/SetBounds.js'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashSideBar = document.createElement('div')
  $SashSideBar.className = 'Viewlet SashVertical'
  $SashSideBar.id = 'SashSideBar'
  $SashSideBar.onpointerdown = ViewletLayoutEvents.handleSashPointerDown
  $SashSideBar.ondblclick = ViewletLayoutEvents.handleSashDoubleClick

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashPanel = document.createElement('div')
  $SashPanel.className = 'Viewlet SashHorizontal'
  $SashPanel.id = 'SashPanel'
  $SashPanel.onpointerdown = ViewletLayoutEvents.handleSashPointerDown
  $SashPanel.ondblclick = ViewletLayoutEvents.handleSashDoubleClick

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Workbench'
  $Viewlet.className = 'Viewlet Layout'
  // @ts-ignore
  $Viewlet.role = AriaRoles.Application
  $Viewlet.append($SashSideBar, $SashPanel)

  window.addEventListener(DomEventType.Resize, ViewletLayoutEvents.handleResize)

  return {
    $Viewlet,
    $SashSideBar,
    $SashPanel,
  }
}

export const setSashes = (state, sashSideBar, sashPanel) => {
  const { $SashSideBar, $SashPanel } = state
  SetBounds.setBounds($SashSideBar, sashSideBar.left, sashSideBar.top, sashSideBar.width, sashSideBar.height)
  SetBounds.setBounds($SashPanel, sashPanel.left, sashPanel.top, sashPanel.width, sashPanel.height)
}
