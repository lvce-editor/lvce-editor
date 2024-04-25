import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

const dispatch =
  (key) =>
  (...args) => {
    GlobalEventBus.emitEvent(key, ...args)
  }
export const handleDidNavigate = dispatch('browser-view-did-navigate')

export const handleTitleUpdated = dispatch('browser-view-title-updated')

export const handleWillNavigate = dispatch('browser-view-will-navigate')

export const isOpen = () => {
  return false
}
