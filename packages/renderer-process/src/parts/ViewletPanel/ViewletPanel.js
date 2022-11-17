import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as ViewletPanelEvents from './ViewletPanelEvents.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
}

const create$PanelTab = (label, index) => {
  const $PanelTab = document.createElement('div')
  $PanelTab.className = 'PanelTab'
  // @ts-ignore
  $PanelTab.role = AriaRoles.Tab
  $PanelTab.textContent = label
  $PanelTab.id = `PanelTab-${index + 1}`
  return $PanelTab
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const panelTabsHandleClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'PanelTab': {
      const index = getNodeIndex($Target)
      RendererWorker.send(
        /* Panel.selectIndex */ 'Panel.selectIndex',
        /* index */ index
      )
      break
    }
    default:
      break
  }
}

export const create = () => {
  const $PanelTabs = document.createElement('div')
  $PanelTabs.className = 'PanelTabs'
  // @ts-ignore
  $PanelTabs.role = AriaRoles.TabList
  $PanelTabs.onmousedown = panelTabsHandleClick
  $PanelTabs.tabIndex = -1

  const $ButtonClose = IconButton.create$Button(UiStrings.Close, Icon.Close)
  $ButtonClose.onclick = ViewletPanelEvents.handleClickClose

  const $PanelToolBar = document.createElement('div')
  $PanelToolBar.className = 'PanelToolBar'
  // @ts-ignore
  $PanelToolBar.role = AriaRoles.ToolBar
  $PanelToolBar.append($ButtonClose)

  const $PanelHeader = document.createElement('div')
  $PanelHeader.className = 'PanelHeader'
  $PanelHeader.append($PanelTabs, $PanelToolBar)
  // const $PanelContent = document.createElement('div')
  // $PanelContent.id = 'PanelContent'
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Panel'
  $Viewlet.className = 'Viewlet Panel'
  $Viewlet.append($PanelHeader)
  $Viewlet.ariaLabel = 'Panel'
  return {
    $Panel: $Viewlet,
    $Viewlet,
    $PanelTabs,
    $PanelHeader,
    $PanelContent: undefined,
  }
  // await openViewlet('Terminal')
}

export const setTabs = (state, tabs) => {
  const { $PanelTabs } = state
  $PanelTabs.append(...tabs.map(create$PanelTab))
}

export const appendViewlet = (state, name, $Viewlet) => {
  Assert.object(state)
  Assert.string(name)
  Assert.object($Viewlet)
  // TODO is it a problem that the id is duplicated for a short amount of time here?
  $Viewlet.id = 'PanelContent'
  if (state.$PanelContent) {
    state.$PanelContent.replaceWith($Viewlet)
  } else {
    state.$Panel.append($Viewlet)
  }
  state.$PanelContent = $Viewlet
}

// TODO add test for focus method
export const focus = (state) => {
  Assert.object(state)
  if (!state.currentViewlet) {
    return
  }
  state.currentViewlet.factory.focus(state.currentViewlet.state)
}

export const dispose = (state) => {
  if (state.$PanelContent) {
    state.$PanelContent.remove()
    state.$PanelContent = undefined
  }
  if (state.$PanelTabs) {
    state.$PanelTabs.remove()
    state.$PanelTabs = undefined
  }
  if (state.$PanelHeader) {
    state.$PanelHeader.remove()
    state.$PanelHeader = undefined
  }
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $PanelTabs } = state
  if (oldIndex !== -1) {
    const $PanelTab = $PanelTabs.children[oldIndex]
    $PanelTab.removeAttribute('aria-selected')
  }
  if (newIndex !== -1) {
    const $PanelTab = $PanelTabs.children[newIndex]
    $PanelTab.ariaSelected = true
    $PanelTabs.setAttribute('aria-activedescendant', $PanelTab.id)
  }
}
