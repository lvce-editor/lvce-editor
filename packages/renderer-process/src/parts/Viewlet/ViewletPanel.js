import * as Assert from '../Assert/Assert.js'
import * as Layout from '../Layout/Layout.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const create$PanelTab = (label) => {
  const $PanelTab = document.createElement('div')
  $PanelTab.className = 'PanelTab'
  $PanelTab.setAttribute('role', 'tab')
  $PanelTab.tabIndex = -1
  $PanelTab.textContent = label
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
        /* Panel.tabsHandleClick */ 'Panel.tabsHandleClick',
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
  $PanelTabs.id = 'PanelTabs'
  $PanelTabs.setAttribute('role', 'tablist')
  $PanelTabs.onmousedown = panelTabsHandleClick
  const $PanelHeader = document.createElement('div')
  $PanelHeader.id = 'PanelHeader'
  $PanelHeader.append($PanelTabs)
  // const $PanelContent = document.createElement('div')
  // $PanelContent.id = 'PanelContent'
  const $Panel = Layout.state.$Panel
  $Panel.append($PanelHeader)
  $Panel.ariaLabel = 'Panel'
  return {
    $Panel,
    $PanelTabs,
    $PanelHeader,
    $PanelContent: undefined,
  }
  // await openViewlet('Terminal')
}

export const setTabs = (state, tabs) => {
  console.log({ tabs })
  state.$PanelTabs.append(...tabs.map(create$PanelTab))
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

export const selectTab = (state, oldSelectedIndex, newSelectedIndex) => {
  const { $PanelTabs } = state
  if (oldSelectedIndex !== -1) {
    const $PanelTab = $PanelTabs.children[oldSelectedIndex]
    $PanelTab.removeAttribute('aria-selected')
    $PanelTab.tabIndex = -1
  }
  if (newSelectedIndex !== -1) {
    const $PanelTab = $PanelTabs.children[newSelectedIndex]
    $PanelTab.ariaSelected = true
    $PanelTab.tabIndex = 0
  }
}
