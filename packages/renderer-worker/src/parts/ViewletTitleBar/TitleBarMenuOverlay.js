import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
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

export const reconcile = async (state) => {
  const componentState = await TitleBarWorker.invoke('TitleBar.getComponentState', state.uid)
  const titleBarMenuOpen = componentState.isMenuOpen === true
  if (state.titleBarMenuOpen !== true && titleBarMenuOpen) {
    await show()
  }
  return { ...state, titleBarMenuOpen }
}
