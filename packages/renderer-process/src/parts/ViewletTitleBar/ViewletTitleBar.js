import * as Layout from '../Layout/Layout.js'
import * as TitleBarMenu from '../TitleBarMenuBar/TitleBarMenuBar.js'
import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $TitleBarMenu = TitleBarMenu.create()
  // TODO set aria label for title bar menu
  // TODO add tests for aria properties
  const $TitleBar = Layout.state.$TitleBar
  $TitleBar.ariaLabel = 'Title Bar'
  $TitleBar.role = 'contentinfo'
  $TitleBar.append($TitleBarMenu)
  return {
    $TitleBar,
    $TitleBarMenu,
  }
}

export const dispose = (state) => {}

export const focus = (state) => {
  state.$TitleBarMenu.firstChild.focus()
}

export const menuSetEntries = TitleBarMenu.setEntries

export const menuFocusIndex = TitleBarMenu.focusIndex

export const menuOpen = TitleBarMenu.openMenu

export const menuClose = TitleBarMenu.closeMenu

export const menuGetEntryBounds = TitleBarMenu.getMenuEntryBounds
