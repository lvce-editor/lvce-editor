import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'

export const handleDidNavigate = (id, url) => {
  // console.log({ id, url })
  GlobalEventBus.emitEvent('browser-view-did-navigate', id, url)
}

export const handleTitleUpdated = (id, title) => {
  // TODO dispatch event to global view event bus (send to all views?)
  // views return new state, causing rerender
  // console.log({ id, title })
  GlobalEventBus.emitEvent('browser-view-title-updated', id, title)
}

export const handleWillNavigate = (id, url) => {
  // TODO dispatch event to global view event bus (send to all views?)
  // views return new state, causing rerender
  // console.log({ id, title })
  GlobalEventBus.emitEvent('browser-view-will-navigate', id, url)
}

export const isOpen = () => {
  return false
}
