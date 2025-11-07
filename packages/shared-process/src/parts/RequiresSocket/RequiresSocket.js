// TODO find a better way to do this
// most commands don't require sockets
// but output channel and terminal need to continuously send data through the socket

// TODO remove all of these
const METHODS_THAT_REQUIRE_SOCKET = new Set([
  'OutputChannel.open',
  'ExtensionHost.start',
  'ExtensionHost.send',
  'ExtensionHost.watchColorTheme',
  'ExtensionHost.watchForHotReload',
  'Terminal.create',
  'IncrementalTextSearch.start',
  'ElectronApplicationMenu.setItems',
  'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  'ElectronBrowserView.createBrowserView',
  'ElectronWebContentsView.createWebContentsView',
  'FileWatcher.watch',
  'FileWatcher.watchFile2',
])

export const requiresSocket = (method) => {
  return METHODS_THAT_REQUIRE_SOCKET.has(method)
}
