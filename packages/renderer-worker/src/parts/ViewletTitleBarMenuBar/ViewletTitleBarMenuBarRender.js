import * as GetVisibleTitleBarEntries from '../GetVisibleTitleBarEntries/GetVisibleTitleBarEntries.js'
import * as GetMenuVirtualDom from '../GetMenuVirtualDom/GetMenuVirtualDom.js'

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
        const dom = GetMenuVirtualDom.getMenuVirtualDom(newMenu.items).slice(1)
        changes.push([/* method */ 'updateMenu', newMenu, /* newLength */ newLength, dom])
      }
    }
    const difference = newLength - oldLength
    if (difference > 0) {
      const dom = GetMenuVirtualDom.getMenuVirtualDom(newMenus.at(-1).items).slice(1)
      console.log({ dom })
      changes.push(['addMenu', newMenus.at(-1), dom])
    } else if (difference < 0) {
      changes.push(['closeMenus', newLength])
    }
    return [/* method */ 'setMenus', /* changes */ changes, newState.uid]
  },
}

export const render = [renderTitleBarEntries, renderFocusedIndex, renderMenus]
