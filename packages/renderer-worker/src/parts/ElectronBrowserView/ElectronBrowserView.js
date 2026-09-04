import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

let pendingEvent = Promise.resolve()

const dispatch =
  (key) =>
  (...args) => {
    const event = pendingEvent.then(() => GlobalEventBus.emitEvent(key, ...args))
    pendingEvent = event.catch(() => {})
    return event
  }
export const handleDidNavigate = dispatch('browser-view-did-navigate')

export const handleAudioStateChanged = dispatch('browser-view-audio-state-changed')

export const handleBrowserViewDestroyed = dispatch('browser-view-destroyed')

export const handleContextMenu = dispatch('browser-view-context-menu')

export const handleKeyBinding = dispatch('browser-view-key-binding')

export const handlePageFaviconUpdated = dispatch('browser-view-page-favicon-updated')

export const handleTitleUpdated = dispatch('browser-view-title-updated')

export const handleWillNavigate = dispatch('browser-view-will-navigate')

export const handleWindowOpen = dispatch('browser-view-window-open')

export const isOpen = () => {
  return false
}
