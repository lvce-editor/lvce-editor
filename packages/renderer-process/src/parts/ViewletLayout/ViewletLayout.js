import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ViewletLayoutEvents from './ViewletLayoutEvents.js'

export const name = 'Layout'

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

  window.addEventListener('resize', ViewletLayoutEvents.handleResize)

  return {
    $Viewlet,
    $SashSideBar,
    $SashPanel,
  }
}

export const setSashes = (state, sashSideBar, sashPanel) => {
  const { $SashSideBar, $SashPanel } = state
  $SashSideBar.style.top = `${sashSideBar.top}px`
  $SashSideBar.style.left = `${sashSideBar.left}px`
  $SashSideBar.style.width = `${sashSideBar.width}px`
  $SashSideBar.style.height = `${sashSideBar.height}px`
  $SashPanel.style.top = `${sashPanel.top}px`
  $SashPanel.style.left = `${sashPanel.left}px`
  $SashPanel.style.width = `${sashPanel.width}px`
  $SashPanel.style.height = `${sashPanel.height}px`
}
