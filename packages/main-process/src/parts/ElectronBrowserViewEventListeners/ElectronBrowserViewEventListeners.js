import * as Debug from '../Debug/Debug.js'
import * as ElectronDispositionType from '../ElectronDispositionType/ElectronDispositionType.js'
import * as ElectronInputType from '../ElectronInputType/ElectronInputType.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as ElectronWindowOpenActionType from '../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js'
import * as Logger from '../Logger/Logger.js'

const normalizeKey = (key) => {
  if (key === ' ') {
    return 'Space'
  }
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

const getIdentifier = (input) => {
  let identifier = ''
  if (input.control) {
    identifier += 'ctrl+'
  }
  if (input.shift) {
    identifier += 'shift+'
  }
  if (input.alt) {
    identifier += 'alt+'
  }
  if (input.meta) {
    identifier += 'meta+'
  }
  identifier += normalizeKey(input.key)
  return identifier
}

export const windowOpen = {
  key: 'window-open',
  attach(webContents, listener) {
    webContents.setWindowOpenHandler(listener)
  },
  detach(webContents, listener) {
    webContents.setWindowOpenHandler(null)
  },
  handler({ url, disposition, features, frameName, referrer, postBody }) {
    // TODO maybe need to put this function into a closure
    if (url === 'about:blank') {
      return {
        result: {
          action: ElectronWindowOpenActionType.Allow,
        },
        messages: [],
      }
    }
    // console.log({ disposition, features, frameName, referrer, postBody })
    if (disposition === ElectronDispositionType.BackgroundTab) {
      return {
        result: {
          action: ElectronWindowOpenActionType.Deny,
        },
        messages: [['handleWindowOpen', url]],
      }
    }
    if (disposition === ElectronDispositionType.NewWindow) {
      return {
        result: {
          action: ElectronWindowOpenActionType.Allow,
        },
        messages: [],
      }
    }
    Logger.info(`[main-process] blocked popup for ${url}`)
    return {
      result: {
        action: ElectronWindowOpenActionType.Deny,
      },
      messages: [],
    }
  },
}

export const willNavigate = {
  key: 'will-navigate',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.WillNavigate, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.WillNavigate, listener)
  },
  handler(event, url) {
    return {
      result: undefined,
      messages: [['handleWillNavigate', url]],
    }
  },
}

export const didNavigate = {
  key: 'did-navigate',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.DidNavigate, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.DidNavigate, listener)
  },
  handler(event, url) {
    Debug.debug(`[main-process] did navigate to ${url}`)
    console.log(`[main-process] did navigate to ${url}`)
    return {
      result: undefined,
      messages: [['handleDidNavigate', url]],
    }
  },
}

export const contextMenu = {
  key: 'context-menu',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.ContextMenu, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.ContextMenu, listener)
  },
  handler(event, params) {
    return {
      result: undefined,
      messages: [['handleContextMenu', params]],
    }
  },
}

export const pageTitleUpdated = {
  key: 'page-title-updated',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.PageTitleUpdated, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.PageTitleUpdated, listener)
  },
  handler(event, title) {
    return {
      result: undefined,
      messages: [['handleTitleUpdated', title]],
    }
  },
}

export const destroyed = {
  key: 'destroyed',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.Destroyed, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.Destroyed, listener)
  },
  handler() {
    return {
      result: undefined,
      messages: [['handleBrowserViewDestroyed']],
    }
  },
}

export const beforeInput = {
  key: 'before-input',
  attach(webContents, listener) {
    webContents.on(ElectronWebContentsEventType.BeforeInputEvent, listener)
  },
  detach(webContents, listener) {
    webContents.off(ElectronWebContentsEventType.BeforeInputEvent, listener)
  },
  handler(event, input) {
    if (input.type !== ElectronInputType.KeyDown) {
      return {
        result: undefined,
        messages: [],
      }
    }
    const falltroughKeyBindings = [] // TODO
    const identifier = getIdentifier(input)
    for (const fallThroughKeyBinding of falltroughKeyBindings) {
      if (fallThroughKeyBinding.key === identifier) {
        event.preventDefault()
        return {
          result: undefined,
          messages: [['handleKeyBinding', fallThroughKeyBinding.command, fallThroughKeyBinding.args || []]],
        }
      }
    }
    return {
      result: undefined,
      messages: [],
    }
  },
}
