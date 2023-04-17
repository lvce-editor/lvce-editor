import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Context from '../Context/Context.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Platform from '../Platform/Platform.js'
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
  $Viewlet.role = AriaRoles.Application
  $Viewlet.append($SashSideBar, $SashPanel)

  // TODO is this the right place for browser context ?
  // maybe in env file / env service
  const browser = Platform.getBrowser()
  Context.set(`browser.${browser}`, true)
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
  window.addEventListener(DomEventType.Focus, ViewletLayoutEvents.handleFocus)
  window.addEventListener(DomEventType.Blur, ViewletLayoutEvents.handleBlur)
  window.addEventListener(DomEventType.KeyDown, ViewletLayoutEvents.handleKeyDown)
  window.addEventListener(DomEventType.KeyUp, ViewletLayoutEvents.handleKeyUp)
}

export const setSashes = (state, sashSideBar, sashPanel) => {
  const { $SashSideBar, $SashPanel } = state
  SetBounds.setBounds($SashSideBar, sashSideBar.x, sashSideBar.y, sashSideBar.width, sashSideBar.height)
  SetBounds.setBounds($SashPanel, sashPanel.x, sashPanel.y, sashPanel.width, sashPanel.height)
}
