const currentUrl = new URL(import.meta.url)
const assetDir = currentUrl.pathname.startsWith('/remote/') ? '' : currentUrl.pathname.slice(0, currentUrl.pathname.indexOf('/packages/'))
const { WebWorkerRpcClient } = await import(`${assetDir}/js/lvce-editor-rpc.js`)

await WebWorkerRpcClient.create({
  commandMap: {
    'ExtensionApi.providePorts'(uri) {
      if (uri !== 'codespaces://test-space/workspaces/app') throw new Error(`Unexpected workspace URI: ${uri}`)
      return [{ port: 3000, forwardedAddress: 'https://test-space-3000.app.github.dev/', origin: 'devcontainer.json' }]
    },
    'ExtensionApi.executeFileSystemProviderIsReadonly'() {
      return true
    },
    'ExtensionApi.executeFileSystemProviderReadDirWithFileTypes'() {
      return []
    },
    'ExtensionApi.getFileSystemProviderRegistrySnapshot'() {
      return { providers: [{ id: 'codespaces' }] }
    },
    'ExtensionApi.getStatusBarItems'() {
      return []
    },
    'ExtensionApi.getViewRegistrySnapshot'() {
      return { views: [] }
    },
    'ExtensionApi.getViewActions'() {
      return []
    },
    'ExtensionApi.getViewMenuEntries'() {
      return []
    },
  },
})
