const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

let content = 'before save'
const commandMap = {
  'ExtensionApi.executeFileSystemProviderIsReadonly'() {
    return false
  },
  'ExtensionApi.executeFileSystemProviderReadDirWithFileTypes'() {
    return [{ name: 'note.txt', type: 7 }]
  },
  'ExtensionApi.executeFileSystemProviderReadFile'() {
    return content
  },
  'ExtensionApi.executeFileSystemProviderWriteFile'(_id, _uri, value) {
    content = value
  },
  'ExtensionApi.getFileSystemProviderRegistrySnapshot'() {
    return { providers: [{ id: 'save-test' }] }
  },
  'ExtensionApi.getStatusBarItems'() {
    return []
  },
  'ExtensionApi.getViewActions'() {
    return []
  },
  'ExtensionApi.getViewMenuEntries'() {
    return []
  },
  'ExtensionApi.getViewRegistrySnapshot'() {
    return { views: [] }
  },
}

await WebWorkerRpcClient.create({ commandMap })
