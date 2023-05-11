import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Tab from '../Tab/Tab.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletMainTabEvents from './ViewletMainTabEvents.js'

/**
 * @enum {string}
 */
const ClassNames = {
  MainTabSelected: 'MainTabSelected',
  Dirty: 'Dirty',
}

export const create = () => {
  const $MainTabs = document.createElement('div')
  $MainTabs.className = 'Viewlet MainTabs'
  $MainTabs.role = AriaRoles.TabList
  // TODO race condition: what if tab has already been closed?
  return {
    $Viewlet: $MainTabs,
    $MainTabs,
  }
}

export const attachEvents = (state) => {
  const { $MainTabs } = state
  $MainTabs.onmousedown = ViewletMainTabEvents.handleTabsMouseDown
  $MainTabs.oncontextmenu = ViewletMainTabEvents.handleTabsContextMenu
  $MainTabs.ondragstart = ViewletMainTabEvents.handleDragStart
  $MainTabs.addEventListener(DomEventType.Wheel, ViewletMainTabEvents.handleTabsWheel, DomEventOptions.Passive)
  $MainTabs.onpointerover = ViewletMainTabEvents.handlePointerOver
  $MainTabs.onpointerout = ViewletMainTabEvents.handlePointerOut
}

export const setTabs = (state, tabs) => {
  const { $Viewlet } = state
  const $$Tabs = []
  for (const tab of tabs) {
    const $Tab = Tab.create(tab.label, tab.title, tab.icon, tab.tabWidth, tab.preview, true)
    $$Tabs.push($Tab)
  }
  $Viewlet.replaceChildren(...$$Tabs)
}

export const setTabsDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const setScrollLeft = (state, scrollLeft) => {
  const { $Viewlet } = state
  $Viewlet.scrollLeft = scrollLeft
}

export const setScrollBar = (state, scrollBarWidth) => {
  // TODO
  // if (!state.$ScrollBar) {
  //   const $ScrollBarThumb = document.createElement('div')
  //   $ScrollBarThumb.className = 'ScrollBarThumbHorizontal'
  //   const $ScrollBar = document.createElement('div')
  //   $ScrollBar.className = 'ScrollBarHorizontalSmall'
  //   $ScrollBar.append($ScrollBarThumb)
  //   $ScrollBar.style.width = `100%`
  //   state.$ScrollBar = $ScrollBar
  //   state.$ScrollBarThumb = $ScrollBarThumb
  //   state.$Viewlet.append($ScrollBar)
  // }
  // const { $Viewlet, $ScrollBar, $ScrollBarThumb } = state
  // $ScrollBarThumb.style.width = `${scrollBarWidth}px`
}

export const setDirty = (state, index, dirty) => {
  Assert.number(index)
  Assert.boolean(dirty)
  const { $MainTabs } = state
  const $Child = $MainTabs.children[index]
  if (dirty) {
    $Child.classList.add(ClassNames.Dirty)
  } else {
    $Child.classList.remove(ClassNames.Dirty)
  }
}

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $Viewlet } = state
  if (oldFocusedIndex !== -1) {
    const $OldItem = $Viewlet.children[oldFocusedIndex]
    $OldItem.ariaSelected = false
    $OldItem.classList.remove(ClassNames.MainTabSelected)
  }
  const $NewItem = $Viewlet.children[newFocusedIndex]
  $NewItem.ariaSelected = true
  $NewItem.classList.add(ClassNames.MainTabSelected)
}
