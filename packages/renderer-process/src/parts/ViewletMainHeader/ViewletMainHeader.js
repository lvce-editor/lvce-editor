import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Label from '../Label/Label.js'
import * as ViewletMainHeaderEvents from './ViewletMainHeaderEvents.js'

const create$MainTab = (label, index) => {
  const $TabLabel = Label.create(label)

  const $TabCloseButton = document.createElement('button')
  $TabCloseButton.className = 'EditorTabCloseButton'
  $TabCloseButton.ariaLabel = 'Close'
  $TabCloseButton.title = ''

  const $Tab = document.createElement('div')
  $Tab.title = label
  // @ts-ignore
  $Tab.role = AriaRoles.Tab
  $Tab.className = 'MainTab'
  $Tab.append($TabLabel, $TabCloseButton)
}

// TODO Main should not be bound to Editor -> Lazy load Editor
export const create = () => {
  const $Tabs = document.createElement('div')
  $Tabs.className = 'MainTabs'
  // @ts-ignore
  $Tabs.role = AriaRoles.TabList
  $Tabs.onmousedown = ViewletMainHeaderEvents.handleTabsMouseDown
  $Tabs.oncontextmenu = ViewletMainHeaderEvents.handleTabsContextMenu
  // TODO race condition: what if tab has already been closed?

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet MainHeader'
  $Viewlet.append($Tabs)
  return {
    $Viewlet,
    $Tabs,
  }
}

export const setTabs = (state, tabs) => {
  const { $Tabs } = state
  $Tabs.append(...tabs.map(create$MainTab))
}

export const setSelectedIndex = (state, oldIndex, newIndex) => {
  const { $Tabs } = state
  if (oldIndex !== -1) {
    const $Tab = $Tabs.children[oldIndex]
    $Tab.removeAttribute('aria-selected')
  }
  if (newIndex !== -1) {
    const $Tab = $Tabs.children[newIndex]
    $Tab.ariaSelected = true
    $Tabs.setAttribute('aria-activedescendant', $Tab.id)
  }
}
