import * as SimpleBrowserOverlay from '../SimpleBrowserOverlay/SimpleBrowserOverlay.js'

export const titleBarMenuOverlayId = 'title-bar-menu'

export const show = () => {
  return SimpleBrowserOverlay.show(titleBarMenuOverlayId)
}

export const afterRender = async (oldState, newState) => {
  const wasTitleBarMenuOpen = oldState.titleBarMenuOpen === true
  const isTitleBarMenuOpen = newState.titleBarMenuOpen === true
  if (wasTitleBarMenuOpen && !isTitleBarMenuOpen) {
    await SimpleBrowserOverlay.hide(titleBarMenuOverlayId)
  }
}
