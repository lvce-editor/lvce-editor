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

/**
 *
 * @param {MouseEvent} event
 */
const handleTitleBarButtonsClick = (event) => {
  console.log(event)
}

export const setButtons = (state, buttons) => {
  const { $TitleBar } = state
  const $TitleBarButtons = document.createElement('div')
  // TODO wrapper div isn't actually necessary
  $TitleBarButtons.id = 'TitleBarButtons'
  for (const button of buttons) {
    const $Icon = document.createElement('i')
    $Icon.className = `MaskIcon${button.icon}`
    const $TitleBarButton = document.createElement('button')
    $TitleBarButton.className = 'TitleBarButton'
    $TitleBarButton.ariaLabel = button.label
    $TitleBarButton.append($Icon)
    $TitleBarButtons.append($TitleBarButton)
  }
  $TitleBarButtons.onmousedown = handleTitleBarButtonsClick
  $TitleBar.append($TitleBarButtons)
}
