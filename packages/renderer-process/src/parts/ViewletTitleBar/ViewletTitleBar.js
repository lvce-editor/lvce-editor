import * as Layout from '../Layout/Layout.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as TitleBarMenu from '../TitleBarMenuBar/TitleBarMenuBar.js'

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

const handleTitleBarButtonClickMinmize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickMinimize')
}

const handleTitleBarButtonClickToggleMaximize = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickToggleMaximize')
}

const handleTitleBarButtonClickClose = () => {
  RendererWorker.send('TitleBar.handleTitleBarButtonClickClose')
}

/**
 *
 * @param {MouseEvent} event
 */
const handleTitleBarButtonsClick = (event) => {
  const { target } = event
  // @ts-ignore
  const { id } = target
  switch (id) {
    case 'TitleBarButtonMinimize':
      handleTitleBarButtonClickMinmize()
      break
    case 'TitleBarButtonToggleMaximize':
      handleTitleBarButtonClickToggleMaximize()
      break
    case 'TitleBarButtonClose':
      handleTitleBarButtonClickClose()
      break
    default:
      break
  }
}

export const setButtons = (state, buttons) => {
  const { $TitleBar } = state
  if (buttons.length > 0) {
    const $TitleBarButtons = document.createElement('div')
    // TODO wrapper div isn't actually necessary
    $TitleBarButtons.id = 'TitleBarButtons'
    for (const button of buttons) {
      const $Icon = document.createElement('i')
      $Icon.className = `MaskIcon${button.icon}`
      const $TitleBarButton = document.createElement('button')
      $TitleBarButton.className = 'TitleBarButton'
      $TitleBarButton.id = `TitleBarButton${button.id}`
      $TitleBarButton.ariaLabel = button.label
      $TitleBarButton.append($Icon)
      $TitleBarButtons.append($TitleBarButton)
    }
    $TitleBarButtons.onmousedown = handleTitleBarButtonsClick
    $TitleBar.append($TitleBarButtons)
  }
}
