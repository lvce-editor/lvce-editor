import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

let pendingEvent = Promise.resolve()

const dispatch =
  (key, command) =>
  (...args) => {
    const event = pendingEvent.then(() => {
      const browserViewId = command === 'handleContextMenu' ? args[0]?.browserViewId : args[0]
      const instance = ViewletStates.getValues().find(
        (item) => item.moduleId === 'SimpleBrowser' && item.state.tabs.some((tab) => tab.browserViewId === browserViewId),
      )
      if (instance) return Viewlet.executeViewletCommand(instance.state.uid, command, ...args)
      return GlobalEventBus.emitEvent(key, ...args)
    })
    pendingEvent = event.catch(() => {})
    return event
  }
export const handleDidNavigate = dispatch('browser-view-did-navigate', 'handleDidNavigate')

export const handleAudioStateChanged = dispatch('browser-view-audio-state-changed', 'handleAudioStateChanged')

export const handleBrowserViewDestroyed = dispatch('browser-view-destroyed', 'handleBrowserViewDestroyed')

export const handleContextMenu = dispatch('browser-view-context-menu', 'handleContextMenu')

export const handleKeyBinding = dispatch('browser-view-key-binding', 'handleKeyBinding')

export const handlePageFaviconUpdated = dispatch('browser-view-page-favicon-updated', 'handlePageFaviconUpdated')

export const handleTitleUpdated = dispatch('browser-view-title-updated', 'handleTitleUpdated')

export const handleWillNavigate = dispatch('browser-view-will-navigate', 'handleWillNavigate')

export const handleWindowOpen = dispatch('browser-view-window-open', 'handleWindowOpen')

export const isOpen = () => {
  return false
}
