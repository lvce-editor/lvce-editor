import * as GetVisibleTitleBarEntries from '../GetVisibleTitleBarEntries/GetVisibleTitleBarEntries.js'
import * as GetMenuVirtualDom from '../GetMenuVirtualDom/GetMenuVirtualDom.js'
import * as GetVisibleMenuItems from '../GetVisibleMenuItems/GetVisibleMenuItems.js'

export const hasFunctionalRender = true

const renderTitleBarEntries = {
  isEqual(oldState, newState) {
    return oldState.titleBarEntries === newState.titleBarEntries && oldState.width === newState.width
  },
  apply(oldState, newState) {
    const visibleEntries = GetVisibleTitleBarEntries.getVisibleTitleBarEntries(newState.titleBarEntries, newState.width)
    return [/* method */ 'setEntries', /* titleBarEntries */ visibleEntries]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.isMenuOpen === newState.isMenuOpen
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex,
      /* newfocusedIndex */ newState.focusedIndex,
      /* oldIsMenuOpen */ oldState.isMenuOpen,
      /* newIsMenuOpen */ newState.isMenuOpen,
    ]
  },
}

const renderMenus = {
  isEqual(oldState, newState) {
    return oldState.menus === newState.menus
  },
  apply(oldState, newState) {
    const oldMenus = oldState.menus
    const newMenus = newState.menus
    const oldLength = oldMenus.length
    const newLength = newMenus.length
    const commonLength = Math.min(oldLength, newLength)
    const changes = []
    for (let i = 0; i < commonLength; i++) {
      const oldMenu = oldMenus[i]
      const newMenu = newMenus[i]
      if (oldMenu !== newMenu) {
        const visible = GetVisibleMenuItems.getVisible(newMenu.items, newMenu.focusedIndex)
        const dom = GetMenuVirtualDom.getMenuVirtualDom(visible).slice(1)
        changes.push([/* method */ 'updateMenu', newMenu, /* newLength */ newLength, dom])
      }
    }
    const difference = newLength - oldLength
    if (difference > 0) {
      const newMenu = newMenus.at(-1)
      const visible = GetVisibleMenuItems.getVisible(newMenu.items, newMenu.focusedIndex)
      const dom = GetMenuVirtualDom.getMenuVirtualDom(visible).slice(1)
      console.log({ newMenu })
      changes.push(['addMenu', newMenu, dom])
    } else if (difference < 0) {
      changes.push(['closeMenus', newLength])
    }
    return [/* method */ 'setMenus', /* changes */ changes, newState.uid]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
