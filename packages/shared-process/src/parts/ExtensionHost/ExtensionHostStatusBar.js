export const getStatusBarItems = (extensionHost) => {
  return extensionHost.invoke('StatusBar.getStatusBarItems')
}

export const registerChangeListener = (extensionHost, id) => {
  return extensionHost.invoke('StatusBar.registerChangeListener', id)
}
