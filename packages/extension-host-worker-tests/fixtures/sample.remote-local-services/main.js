const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)
await WebWorkerRpcClient.create({
  commandMap: {
    'ExtensionApi.executeFileSystemProviderIsReadonly': () => true,
    'ExtensionApi.executeFileSystemProviderReadDirWithFileTypes': () => [{ name: 'remote.txt', type: 1 }],
    'ExtensionApi.executeFileSystemProviderReadFile': () => 'remote provider content',
    'ExtensionApi.getFileSystemProviderRegistrySnapshot': () => ({ providers: [{ id: 'remote-test' }] }),
    'ExtensionApi.getStatusBarItems': () => [],
    'ExtensionApi.getViewRegistrySnapshot': () => ({ views: [] }),
    'ExtensionApi.getViewActions': () => [],
    'ExtensionApi.getViewMenuEntries': () => [],
  },
})
