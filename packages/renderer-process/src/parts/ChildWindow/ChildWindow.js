export const state = {
  windows: Object.create(null),
}

export const open = (windowId, url, target, features) => {
  const browserWindow = window.open(url, target, features)
  state.windows[windowId] = browserWindow
}

export const postMessage = (windowId, message) => {
  const browserWindow = state.windows[windowId]
  browserWindow.postMessage(message)
}
